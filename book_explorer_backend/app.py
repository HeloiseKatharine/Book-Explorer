from flask import Flask, jsonify, request
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from flask_cors import CORS
from bson import ObjectId


app = Flask(__name__)

CORS(app)

load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
DB_NAME =  os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]  

favorites_list = db['favorites_list']
rating_list = db['rating_list']
notes_list =  db['notes_list']


@app.route('/favorites_list', methods=['POST'])
def add_favorites():
    data = request.json
    if not data:
        return jsonify({'error': 'Nenhum dado fornecido.'}), 400
    
    book_id = data.get('bookId')
    rating = data.get('rating')
    notes = data.get('notes', [])
    tags = data.get('tags', [])

    favorite = {
        'bookId': book_id,
        'rating': rating,
        'notes': notes,
        'tags': tags
    }
    
    result = favorites_list.insert_one(favorite)
    
    return jsonify({'message': 'Dados inseridos na lista de favoritos.', 'id': str(result.inserted_id)}), 201

@app.route('/favorites_list', methods=['GET'])
def get_data():
    documents = favorites_list.find()
    result = []
    for doc in documents:
        doc['_id'] = str(doc['_id'])
        result.append(doc)
    return jsonify(result), 200


@app.route('/favorites_list/<book_id>', methods=['DELETE'])
def remove_favorite(book_id):
    result = favorites_list.delete_one({'bookId': book_id})

    if result.deleted_count == 1:
        notes_list.delete_many({'bookId': book_id})
        return jsonify({'message': 'Livro removido dos favoritos com sucesso.'}), 200
    else:
        return jsonify({'error': 'Livro não encontrado.'}), 404

@app.route('/rating_list', methods=['GET'])
def get_rating_list():
    documents = rating_list.find()
    result = []
    for doc in documents:
        doc['_id'] = str(doc['_id'])
        result.append(doc)
    return jsonify(result), 200

@app.route('/rating_list', methods=['POST'])
def add_update_rating():
    data = request.json
    print("entrou aqui.")
    if not data:
        return jsonify({'error': 'Nenhum dado fornecido.'}), 400
    
    book_id = data.get('bookId')
    rating = data.get('rating')
    
    if not book_id or rating is None:
        return jsonify({'error': 'bookId ou rating é None.'}), 400

    existing_rating = rating_list.find_one({'bookId': book_id})

    if existing_rating:
        rating_list.update_one(
            {'bookId': book_id},
            {'$set': {'rating': rating}}
        )
        update_favorites_with_ratings()
        return jsonify({'message': 'Avaliação atualizada com sucesso.'}), 200
    else:
        print("entrou aqui.")
        rating_book = {
            'bookId': book_id,
            'rating': rating,
        }  
    
    result = rating_list.insert_one(rating_book)
    
    update_favorites_with_ratings()

    return jsonify({'message': 'Dados inseridos na lista de avaliações.', 'id': str(result.inserted_id)}), 201
    
@app.route('/note', methods=['POST'])
def add_note():
    data = request.json
    
    if not data:
        return jsonify({'error': 'Nenhum dado fornecido.'}), 400
    
    book_id = data.get('bookId')
    note_text = data.get('noteText')
    
    if not book_id or not note_text:
        return jsonify({'error': 'Ausentes: bookId ou noteText.'}), 400

    note = {
        'bookId': book_id,
        'noteText': note_text,
    }
    
    result = notes_list.insert_one(note)
    note_id = str(result.inserted_id)
    
    favorites_list.update_one(
        {'bookId': book_id},
       {'$push': {'notes': str(note_id)}} 
    )

    return jsonify({'message': 'Nota adicionada com sucesso.', 'id': str(result.inserted_id)}), 201

@app.route('/note/<note_id>', methods=['PUT'])
def edit_note(note_id):
    data = request.json
    
    if not data:
        return jsonify({'error': 'Nenhum dado fornecido.'}), 400
    
    note_text = data.get('noteText')

    if not note_text:
        return jsonify({'error': 'noteText não encontrada.'}), 400

    result = notes_list.update_one(
        {'_id': ObjectId(note_id)},
        {'$set': {'noteText': note_text}}
    )

    if result.matched_count == 0:
        return jsonify({'error': 'Nota não encontrada.'}), 404

    return jsonify({'message': 'Nota atualizada com sucesso.'}), 200

@app.route('/note/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    result = notes_list.delete_one({'_id': ObjectId(note_id)})

    if result.deleted_count == 0:
        return jsonify({'error': 'Nota não encontrada.'}), 404

    return jsonify({'message': 'Nota excluída com sucesso.'}), 200

@app.route('/note', methods=['GET'])
def get_note():
    documents = notes_list.find()
    result = []
    for doc in documents:
        doc['_id'] = str(doc['_id'])
        result.append(doc)
    return jsonify(result), 200

@app.route('/note/<book_id>', methods=['GET'])
def get_notes_by_book_id(book_id):
    try:
        cursor = notes_list.find({'bookId': book_id})
        notes = []
        
        for note in cursor:
            note['_id'] = str(note['_id']) 
            notes.append(note)
        
        if not notes:
            return jsonify({'message': 'Nenhuma nota encontrada para o bookId fornecido.'}), 404
        
        return jsonify(notes), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def update_favorites_with_ratings():

    ratings = rating_list.find({})

    for rating_doc in ratings:
        book_id = rating_doc.get('bookId')
        rating = rating_doc.get('rating')

        result = favorites_list.update_one(
            {'bookId': book_id},
            {'$set': {'rating': rating}}
        )

        if result.modified_count > 0:
            print(f"Favorito com bookId {book_id} foi atualizado com rating {rating}.")
        else:
            print(f"Favorito com bookId {book_id} não encontrado ou já atualizado.")

    
if __name__ == '__main__':
    app.run(debug=True)
