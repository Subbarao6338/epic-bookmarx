import json

def generate_report(results, output_path):
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)
    return output_path
