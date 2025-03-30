from flask import Flask, request, jsonify
import pdfplumber
import docx
import os

app = Flask(__name__)

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
        return text.strip()
    except Exception as e:
        print("❌ PDF parsing error:", e)
        return None

def extract_text_from_docx(docx_path):
    try:
        doc = docx.Document(docx_path)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        print("❌ DOCX parsing error:", e)
        return None

@app.route("/parse-resume", methods=["POST"])
def parse_resume():
    file_path = request.json.get("file_path")
    print("📄 Received file path:", file_path)

    if not file_path or not os.path.exists(file_path):
        print("⚠️ File does not exist:", file_path)
        return jsonify({"error": "Invalid file path"}), 400

    ext = file_path.split(".")[-1].lower()

    if ext == "pdf":
        text = extract_text_from_pdf(file_path)
    elif ext == "docx":
        text = extract_text_from_docx(file_path)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    if not text:
        return jsonify({"error": "Failed to extract text"}), 500

    return jsonify({"extracted_text": text})

if __name__ == "__main__":
    app.run(port=5002, debug=True)
