#!/usr/bin/env python3
"""
JSON Cleaner for AWS Exam Questions
----------------------------------
Cleans and fixes formatting issues in extracted AWS exam questions.
"""

import re
import json
import logging
import argparse
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_json(file_path):
    """Load JSON data from a file."""
    logger.info(f"Loading JSON from {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle different JSON structures
        if isinstance(data, dict) and 'questions' in data:
            questions = data['questions']
        elif isinstance(data, list):
            questions = data
        else:
            logger.error("Unexpected JSON structure")
            return []
        
        logger.info(f"Loaded {len(questions)} questions")
        return questions
    except Exception as e:
        logger.error(f"Error loading JSON: {str(e)}")
        raise

def clean_text(text):
    """Remove excessive newlines and fix spacing."""
    if not text:
        return ""
    
    # Replace newlines with spaces
    text = text.replace('\n', ' ')
    
    # Fix extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Fix common spacing issues
    text = text.replace(' .', '.')
    text = text.replace(' ,', ',')
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)  # Add space between lowercase and uppercase
    
    return text

def extract_correct_answer(options):
    """Extract the correct answer marker from option text."""
    correct_answer = None
    
    # Check each option for "Correct answer" marker
    for letter, text in options.items():
        if "Correct answer" in text or "Correct answer" in text:
            correct_answer = letter
            # Remove the marker from the option text
            options[letter] = text.replace("Correct answer", "").strip()
            options[letter] = options[letter].replace("Correct answer", "").strip()
            break
    
    return correct_answer, options

def extract_explanation(options, last_option_letter):
    """Extract explanation from the last option if it contains 'Overall explanation'."""
    explanation = ""
    
    # Check if the last option contains the explanation
    if last_option_letter in options:
        text = options[last_option_letter]
        explanation_match = re.search(r'(Overall explanation|explanation)(.*)', text, re.IGNORECASE)
        
        if explanation_match:
            explanation = explanation_match.group(2).strip()
            
            # Fix the option text to not include the explanation
            options[last_option_letter] = text[:explanation_match.start()].strip()
    
    return explanation, options

def fix_empty_options(options):
    """Fix empty options by redistributing content from other overloaded options."""
    # Identify which options are empty
    empty_options = [letter for letter, text in options.items() if not text.strip()]
    
    if not empty_options:
        return options
    
    # Get the longest option
    longest_option_letter = max(options, key=lambda k: len(options[k]))
    longest_option_text = options[longest_option_letter]
    
    # Look for patterns that indicate option boundaries
    option_boundaries = []
    for letter in "ABCDEFG":
        if letter not in options:
            continue
        
        pattern = rf'\s{letter}\.\s'
        for match in re.finditer(pattern, longest_option_text):
            option_boundaries.append((letter, match.start()))
    
    # Sort boundaries by position
    option_boundaries.sort(key=lambda x: x[1])
    
    # Redistribute content if boundaries are found
    if option_boundaries:
        for i, (letter, pos) in enumerate(option_boundaries):
            if i == 0:
                continue  # Skip the first one
            
            prev_letter = option_boundaries[i-1][0]
            prev_pos = option_boundaries[i-1][1]
            
            # Extract content for the previous option
            if prev_letter in empty_options:
                content = longest_option_text[prev_pos:pos].strip()
                options[prev_letter] = content
                
                # Remove this content from the longest option
                options[longest_option_letter] = options[longest_option_letter].replace(content, "").strip()
    
    return options

def clean_questions(questions):
    """Clean and fix formatting issues in questions."""
    cleaned_questions = []
    
    for q in questions:
        try:
            # Clean question text
            q['question_text'] = clean_text(q['question_text'])
            
            # Clean options
            options = q['options']
            cleaned_options = {}
            
            for letter, text in options.items():
                cleaned_options[letter] = clean_text(text)
            
            # Fix empty options
            cleaned_options = fix_empty_options(cleaned_options)
            
            # Extract correct answer from option text
            correct_answer, cleaned_options = extract_correct_answer(cleaned_options)
            
            # Extract explanation from last option if necessary
            last_letter = max(cleaned_options.keys())
            explanation, cleaned_options = extract_explanation(cleaned_options, last_letter)
            
            # Use existing explanation if available
            if not explanation and q.get('explanation'):
                explanation = clean_text(q['explanation'])
            
            # Create cleaned question object
            cleaned_q = {
                'question_number': q['question_number'],
                'question_text': q['question_text'],
                'options': cleaned_options,
                'correct_answer': correct_answer or q.get('correct_answer'),
                'explanation': explanation
            }
            
            cleaned_questions.append(cleaned_q)
            logger.info(f"Cleaned question {q['question_number']}")
            
        except Exception as e:
            logger.error(f"Error cleaning question {q.get('question_number', 'unknown')}: {str(e)}")
    
    return cleaned_questions

def save_json(questions, output_file):
    """Save questions to a JSON file."""
    logger.info(f"Saving {len(questions)} questions to {output_file}")
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'total_questions': len(questions),
                'questions': questions
            }, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Successfully saved to {output_file}")
    except Exception as e:
        logger.error(f"Error saving JSON: {str(e)}")
        raise

def main():
    parser = argparse.ArgumentParser(description="Clean and fix formatting in AWS exam questions JSON")
    parser.add_argument("input_file", help="Path to the input JSON file with AWS exam questions")
    parser.add_argument("--output", "-o", help="Output JSON file path (default: cleaned_questions.json)", 
                       default="cleaned_questions.json")
    parser.add_argument("--debug", "-d", action="store_true", help="Enable debug mode")
    args = parser.parse_args()
    
    if args.debug:
        logger.setLevel(logging.DEBUG)
    
    try:
        # Load questions from JSON
        questions = load_json(args.input_file)
        
        if not questions:
            logger.error("No questions found in the input file")
            return 1
        
        # Clean questions
        cleaned_questions = clean_questions(questions)
        
        if not cleaned_questions:
            logger.error("Failed to clean any questions")
            return 1
        
        # Save cleaned questions
        save_json(cleaned_questions, args.output)
        
        logger.info(f"Process completed. Cleaned {len(cleaned_questions)} questions")
        
    except Exception as e:
        logger.error(f"Error processing JSON: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())