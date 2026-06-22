import os
import sys
import unittest

# Add source-code folder to path so memory_agent can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from memory_agent import read_brain_files, get_git_info, run_openrouter_update

class TestMemoryAgent(unittest.TestCase):

    def test_read_brain_files(self):
        contents = read_brain_files()
        required_files = [
            "master-memory.md", "memory.md", "architecture.md", 
            "patterns.md", "decisions.md", "mistakes.md", 
            "roadmap.md", "glossary.md"
        ]
        for filename in required_files:
            self.assertIn(filename, contents)
            # Ensure it is a string type
            self.assertIsInstance(contents[filename], str)

    def test_master_memory_word_limit(self):
        path = os.path.join("brain", "master-memory.md")
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            words = content.split()
            word_count = len(words)
            self.assertLess(word_count, 5000, f"master-memory.md exceeds 5,000 words limit. Current: {word_count}")

    def test_git_info(self):
        commit_msg, git_diff = get_git_info()
        self.assertIsInstance(commit_msg, str)
        self.assertIsInstance(git_diff, str)

    def test_openrouter_api_graceful_failure(self):
        # Using a dummy/empty API key should fail gracefully returning None
        result = run_openrouter_update("", {}, "test commit", "test diff", "test summary")
        self.assertIsNone(result)

if __name__ == "__main__":
    unittest.main()
