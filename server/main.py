from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

client = pymongo.MongoClient("mongodb+srv://Admin:testing123@blocksnet.ukvg2ls.mongodb.net/?retryWrites=true&w=majority&appName=BlocksNet")
db = client["test"]

projects_col = db["projects"]
targets_col = db["targets"]
blocks_col = db["blocks"]

def serialize(doc, id_field="id"):
    doc[id_field] = str(doc.pop("_id"))
    return doc

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "BlocksNet API"})

@app.route('/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Missing project 'name'."}), 400

    proj = {
        "name": data['name'],
        "createdAt": pymongo.datetime.datetime.utcnow(),
        "targetIds": []
    }
    res = projects_col.insert_one(proj)
    proj['id'] = str(res.inserted_id)
    return jsonify(proj), 201

@app.route('/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    proj = projects_col.find_one({"_id": ObjectId(project_id)})
    if not proj:
        return jsonify({"error": "Project not found."}), 404
    serialize(proj)
    return jsonify(proj)
'''
@app.route('/projects/<project_id>/targets', methods=['POST'])
def create_target(project_id):
    data = request.get_json()
    if not data or 'name' not in data or 'isStage' not in data:
        return jsonify({"error": "Missing target 'name' or 'isStage'."}), 400

    if not projects_col.find_one({"_id": ObjectId(project_id)}):
        return jsonify({"error": "Parent project not found."}), 404

    target = {
        "projectId": ObjectId(project_id),
        "name": data['name'],
        "isStage": bool(data['isStage']),
        "costumes": data.get('costumes', []),
        "blockIds": []
    }
    res = targets_col.insert_one(target)
    tid = res.inserted_id
    projects_col.update_one({"_id": ObjectId(project_id)}, {"$push": {"targetIds": tid}})
    target['id'] = str(tid)
    return jsonify(target), 201

@app.route('/projects/<project_id>/targets', methods=['GET'])
def list_targets(project_id):
    targets = targets_col.find({"projectId": ObjectId(project_id)})
    result = []
    for t in targets:
        serialize(t)
        result.append(t)
    return jsonify(result)
'''
@app.route('/projects/<project_id>/blocks', methods=['POST'])
def add_blocks(target_id):
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({"error": "Expected list of blocks."}), 400

    if not targets_col.find_one({"_id": ObjectId(target_id)}):
        return jsonify({"error": "Target not found."}), 404

    block_docs = []
    for blk in data:
        blk_doc = {
            "targetId": ObjectId(target_id),
            "blockId": blk.get('id'),
            "opcode": blk.get('opcode'),
            "parent": blk.get('parent'),
            "next": blk.get('next'),
            "inputs": blk.get('inputs', {}),
            "fields": blk.get('fields', {}),
            "x": blk.get('x'),
            "y": blk.get('y'),
            "shadow": blk.get('shadow', False),
            # CNN-specific fields
            "inputShape": blk.get('inputShape'),        # [height, width, channels]
            "outputShape": blk.get('outputShape'),      # [newH, newW, filters]
            "filters": blk.get('filters'),              # number of filters
            "kernelSize": blk.get('kernelSize'),        # [kH, kW]
            "stride": blk.get('stride'),                # [sH, sW]
            "padding": blk.get('padding'),              # 'same' or 'valid'
            "activation": blk.get('activation')         # 'relu', 'sigmoid', etc.
        }
        block_docs.append(blk_doc)

    res = blocks_col.insert_many(block_docs)
    targets_col.update_one({"_id": ObjectId(target_id)}, {"$push": {"blockIds": {"$each": res.inserted_ids}}})

    serialized = []
    for d in blocks_col.find({"_id": {"$in": res.inserted_ids}}):
        serialize(d)
        serialized.append(d)
    return jsonify(serialized), 201

@app.route('/projects/<project_id>/blocks', methods=['GET'])
def list_blocks(target_id):
    blocks = blocks_col.find({"targetId": ObjectId(target_id)})
    result = []
    for b in blocks:
        serialize(b)
        result.append(b)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
