from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import google.generativeai as gemini
import os
from dotenv import load_dotenv
import json
from userDbModel import db, User
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
# Load .env file
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # Use SQLite for simplicity
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

# Configure Gemini API
gemini.configure(api_key=api_key)

# ---------- ROUTES ----------

@app.route('/')
def login_default():
    return render_template('userLogin.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')

        if not username or not email or not password:
            return render_template('userSignup.html', error="All fields are required.")

        if User.query.filter_by(email=email).first():
            return render_template('userSignup.html', error="Email already exists.")
        else:
            hashed_password = generate_password_hash(password)
            new_user = User(username=username, email=email, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('login', success="User created successfully. Please log in."))

    return render_template('userSignup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if not email or not password:
            return render_template('userLogin.html', error="All fields are required.")
        
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            return render_template('index.html', user=user)  # Replace with your dashboard template
        else:
            return render_template('userLogin.html', error="Invalid email or password.")
    
    return render_template('userLogin.html')

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    # Clear session data here if using sessions
    return redirect(url_for('login'))
@app.route('/aboutus')
def aboutus():
    return render_template('aboutUs.html')

@app.route('/dashboard')
def dashboard():
    username = User.query.first().username if User.query.first() else "Guest"
    return render_template('dashboard.html', username=username)
@app.route('/index')
def index():
    # Render the index template
    return render_template('index.html')
@app.route('/getrecipe')
def getrecipe():
    return render_template('getRecipe.html')
# @app.route('/index')
# def index():
#     return render_template('index.html')

def generate_content(prompt):
    model = gemini.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text

def clean_json_response(ai_response):
    cleaned = ai_response.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()

# ---------- API ENDPOINTS ----------

@app.route('/api/suggest-cuisines', methods=['POST'])
def suggest_cuisines():
    try:
        data = request.get_json()
        ingredients = data.get('ingredients', [])
        if not ingredients:
            return jsonify({'error': 'No ingredients provided'}), 400

        ingredients_text = ', '.join(ingredients)
        prompt = f"""
You are a helpful Pakistani chef AI.
Based on these ingredients: {ingredients_text}, suggest 5-6 cuisines or dishes.

Respond ONLY with JSON. Do not include explanations, notes, or markdown formatting.

Return ONLY in this JSON format:
{{
  "cuisines": [
    {{"name": "Dish Name", "cuisine_type": "Cuisine Type", "description": "Short description"}}
  ]
}}
If you cannot provide the data, respond with: {{"cuisines": []}}
"""

        ai_response = generate_content(prompt)
        cleaned_response = clean_json_response(ai_response)

        return jsonify(json.loads(cleaned_response))

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/fetchRecipe', methods=['POST'])
def fetchRecipe():
    try:
        data = request.get_json()
        dish_name = data.get('dish_name')
        if not dish_name:
            return jsonify({'error': 'Dish name is required'}), 400
        elif dish_name:
         prompt = f"""
You are a Pakistani chef AI.
Create a detailed recipe for "{dish_name}"
Respond ONLY with JSON. Do not include explanations, notes, or markdown formatting.
Return ONLY in this JSON format:
{{
  "recipe": {{
    "name": "{dish_name}",
    "prep_time": "preparation time",
    "cook_time": "cooking time",
    "servings": "number of servings",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["Step 1", "Step 2"],
    "tips": ["Tip 1", "Tip 2"]
  }}
}}
If you cannot provide the data, respond with: {{"recipe": null}}
"""
        ai_response = generate_content(prompt)
        cleaned_response = clean_json_response(ai_response)
        return jsonify(json.loads(cleaned_response))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/get-recipe', methods=['POST'])
def get_recipe():
    try:
        data = request.get_json()
        dish_name = data.get('dish_name')
        ingredients = data.get('ingredients', [])
        if not dish_name or not ingredients:
            return jsonify({'error': 'Dish name or ingredients missing'}), 400

        ingredients_text = ', '.join(ingredients)
        prompt = f"""
You are a Pakistani chef AI.
Create a detailed recipe for "{dish_name}" using these ingredients: {ingredients_text}

Respond ONLY with JSON. Do not include explanations, notes, or markdown formatting.

Return ONLY in this JSON format:
{{
  "recipe": {{
    "name": "{dish_name}",
    "prep_time": "preparation time",
    "cook_time": "cooking time",
    "servings": "number of servings",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["Step 1", "Step 2"],
    "tips": ["Tip 1", "Tip 2"]
  }}
}}
If you cannot provide the data, respond with: {{"recipe": null}}
"""

        ai_response = generate_content(prompt)
        cleaned_response = clean_json_response(ai_response)

        return jsonify(json.loads(cleaned_response))

    except Exception as e:
        return jsonify({'error': str(e)}), 500
# @app.route('/api/add-recipe', methods=['POST'])
# def add_recipe():
#     data = request.get_json()

#     if not data:
#         return jsonify({"error": "Invalid JSON data"}), 400

#     name = data.get('name')
#     ingredients = data.get('ingredients')
#     instructions = data.get('instructions')
#     cuisine_type = data.get('cuisine_type', 'Unknown')

#     if not all([name, ingredients, instructions]):
#         return jsonify({"error": "Name, ingredients, and instructions are required"}), 400

#     if isinstance(ingredients, list):
#         ingredients = '\n'.join(ingredients)
#     if isinstance(instructions, list):
#         instructions = '\n'.join(instructions)

#     new_recipe = Recipe(
#         name=name,
#         ingredients=ingredients,
#         instructions=instructions,
#         cuisine_type=cuisine_type
#     )

#     db.session.add(new_recipe)
#     db.session.commit()

#     return jsonify({"message": "Recipe added successfully!", "recipe_id": new_recipe.id}), 201

# ---------- MAIN ----------

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='127.0.0.1', port=5000, debug=True)
