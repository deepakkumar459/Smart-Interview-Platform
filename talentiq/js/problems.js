// ── problems.js ──

let allProblems = [];
let activeFilter = 'all';
let searchQuery = '';

// ── Seed sample problems into Firestore (run once) ──
const SAMPLE_PROBLEMS = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Map'], acceptance: 49.1, description: 'Given an array of integers <strong>nums</strong> and an integer <strong>target</strong>, return indices of the two numbers such that they add up to target.', examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }], constraints: ['2 <= nums.length <= 10⁴', '-10⁹ <= nums[i] <= 10⁹', 'Only one valid answer exists.'], starterCode: { javascript: 'function twoSum(nums, target) {\n  // Write your solution here\n\n};', python: 'def two_sum(nums, target):\n    # Write your solution here\n    pass', cpp: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n}' }, testCases: [{ input: '[2,7,11,15]\n9', expected: '[0,1]' }, { input: '[3,2,4]\n6', expected: '[1,2]' }] },
  { id: 2, title: 'Valid Parentheses', difficulty: 'Easy', tags: ['Stack', 'String'], acceptance: 40.5, description: 'Given a string <strong>s</strong> containing just the characters <code>(</code>, <code>)</code>, <code>{</code>, <code>}</code>, <code>[</code> and <code>]</code>, determine if the input string is valid.', examples: [{ input: 's = "()"', output: 'true' }, { input: 's = "()[]{}"', output: 'true' }, { input: 's = "(]"', output: 'false' }], constraints: ['1 <= s.length <= 10⁴', 's consists of parentheses only.'], starterCode: { javascript: 'function isValid(s) {\n  // Write your solution here\n\n};', python: 'def is_valid(s):\n    # Write your solution here\n    pass', cpp: '#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your solution here\n}' }, testCases: [{ input: '()', expected: 'true' }, { input: '()[]{}'.replace(/\\/g,''), expected: 'true' }] },
  { id: 3, title: 'Reverse Linked List', difficulty: 'Easy', tags: ['Linked List', 'Recursion'], acceptance: 73.2, description: 'Given the head of a singly linked list, reverse the list, and return the <em>reversed list</em>.', examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }], constraints: ['Number of nodes: [0, 5000]', '-5000 <= Node.val <= 5000'], starterCode: { javascript: 'function reverseList(head) {\n  // Write your solution here\n\n};', python: 'def reverse_list(head):\n    # Write your solution here\n    pass', cpp: 'ListNode* reverseList(ListNode* head) {\n    // Write your solution here\n}' }, testCases: [] },
  { id: 4, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['Hash Map', 'Sliding Window', 'String'], acceptance: 33.8, description: 'Given a string <strong>s</strong>, find the length of the <strong>longest substring</strong> without repeating characters.', examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }], constraints: ['0 <= s.length <= 5 * 10⁴', 's consists of English letters, digits, symbols and spaces.'], starterCode: { javascript: 'function lengthOfLongestSubstring(s) {\n  // Write your solution here\n\n};', python: 'def length_of_longest_substring(s):\n    # Write your solution here\n    pass', cpp: 'int lengthOfLongestSubstring(string s) {\n    // Write your solution here\n}' }, testCases: [] },
  { id: 5, title: 'Container With Most Water', difficulty: 'Medium', tags: ['Array', 'Two Pointers', 'Greedy'], acceptance: 54.0, description: 'You are given an integer array <strong>height</strong> of length <strong>n</strong>. Find two lines that together with the x-axis form a container, such that the container contains the most water.', examples: [{ input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' }], constraints: ['n == height.length', '2 <= n <= 10⁵', '0 <= height[i] <= 10⁴'], starterCode: { javascript: 'function maxArea(height) {\n  // Write your solution here\n\n};', python: 'def max_area(height):\n    # Write your solution here\n    pass', cpp: 'int maxArea(vector<int>& height) {\n    // Write your solution here\n}' }, testCases: [] },
  { id: 6, title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', tags: ['Tree', 'DFS', 'Stack'], acceptance: 74.3, description: 'Given the <strong>root</strong> of a binary tree, return the inorder traversal of its nodes\' values.', examples: [{ input: 'root = [1,null,2,3]', output: '[1,3,2]' }], constraints: ['Number of nodes: [0, 100]', '-100 <= Node.val <= 100'], starterCode: { javascript: 'function inorderTraversal(root) {\n  // Write your solution here\n\n};', python: 'def inorder_traversal(root):\n    # Write your solution here\n    pass', cpp: 'vector<int> inorderTraversal(TreeNode* root) {\n    // Write your solution here\n}' }, testCases: [] },
  { id: 7, title: 'Climbing Stairs', difficulty: 'Easy', tags: ['Dynamic Programming', 'Math'], acceptance: 51.9, description: 'You are climbing a staircase. It takes <strong>n</strong> steps to reach the top. Each time you can either climb <strong>1</strong> or <strong>2</strong> steps. In how many distinct ways can you climb to the top?', examples: [{ input: 'n = 2', output: '2', explanation: 'There are two ways to climb to the top: 1+1, or 2.' }, { input: 'n = 3', output: '3' }], constraints: ['1 <= n <= 45'], starterCode: { javascript: 'function climbStairs(n) {\n  // Write your solution here\n\n};', python: 'def climb_stairs(n):\n    # Write your solution here\n    pass', cpp: 'int climbStairs(int n) {\n    // Write your solution here\n}' }, testCases: [] },
  { id: 8, title: 'Merge K Sorted Lists', difficulty: 'Hard', tags: ['Linked List', 'Divide & Conquer', 'Heap'], acceptance: 50.4, description: 'You are given an array of <strong>k</strong> linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.', examples: [{ input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' }], constraints: ['k == lists.length', '0 <= k <= 10⁴', '0 <= lists[i].length <= 500'], starterCode: { javascript: 'function mergeKLists(lists) {\n  // Write your solution here\n\n};', python: 'def merge_k_lists(lists):\n    # Write your solution here\n    pass', cpp: 'ListNode* mergeKLists(vector<ListNode*>& lists) {\n    // Write your solution here\n}' }, testCases: [] },
  { id: 9, title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Array', 'Two Pointers', 'Stack', 'DP'], acceptance: 60.1, description: 'Given <strong>n</strong> non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }], constraints: ['n == height.length', '1 <= n <= 2 * 10⁴', '0 <= height[i] <= 10⁵'], starterCode: { javascript: 'function trap(height) {\n  // Write your solution here\n\n};', python: 'def trap(height):\n    # Write your solution here\n    pass', cpp: 'int trap(vector<int>& height) {\n    // Write your solution here\n}' }, testCases: [] },
  { id: 10, title: 'Word Search', difficulty: 'Medium', tags: ['Backtracking', 'Matrix', 'DFS'], acceptance: 39.7, description: 'Given an <strong>m x n</strong> grid of characters <strong>board</strong> and a string <strong>word</strong>, return true if word exists in the grid.', examples: [{ input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' }], constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15'], starterCode: { javascript: 'function exist(board, word) {\n  // Write your solution here\n\n};', python: 'def exist(board, word):\n    # Write your solution here\n    pass', cpp: 'bool exist(vector<vector<char>>& board, string word) {\n    // Write your solution here\n}' }, testCases: [] },
];

// ── Seed problems to Firestore (run once from console) ──
async function seedProblems() {
  const batch = db.batch();
  SAMPLE_PROBLEMS.forEach(p => {
    const ref = db.collection('problems').doc(String(p.id));
    batch.set(ref, p);
  });
  await batch.commit();
  console.log('✅ Problems seeded!');
}

// ── Fetch problems from Firestore ──
async function fetchProblems() {
  try {
    const snapshot = await db.collection('problems').orderBy('id').get();
    if (snapshot.empty) {
      // Use local data if Firestore is empty
      return SAMPLE_PROBLEMS;
    }
    return snapshot.docs.map(d => ({ ...d.data(), docId: d.id }));
  } catch (err) {
    console.error('Firestore error, using local data:', err);
    return SAMPLE_PROBLEMS;
  }
}

// ── Get user's solved problems ──
async function getSolvedProblems(userId) {
  try {
    const doc = await db.collection('users').doc(userId).get();
    return doc.exists ? (doc.data().solved || []) : [];
  } catch { return []; }
}

// ── Render problems table ──
function renderProblems(problems, solvedIds = []) {
  const tbody = document.getElementById('problems-tbody');
  if (!tbody) return;

  const filtered = problems.filter(p => {
    const matchDiff = activeFilter === 'all' || p.difficulty.toLowerCase() === activeFilter;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchDiff && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted)">No problems found</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const isSolved = solvedIds.includes(p.id);
    const diffClass = p.difficulty.toLowerCase();
    const tags = p.tags.slice(0, 2).map(t => `<span class="tag-pill">${t}</span>`).join('');
    return `
      <tr onclick="window.location.href='problem.html?id=${p.id}'">
        <td class="solved-check">${isSolved ? '✅' : ''}</td>
        <td class="problem-num">#${p.id}</td>
        <td class="problem-title">
          ${p.title}
          <div style="margin-top:0.25rem">${tags}</div>
        </td>
        <td><span class="badge badge-${diffClass}">${p.difficulty}</span></td>
        <td class="acceptance">${p.acceptance}%</td>
      </tr>
    `;
  }).join('');
}

// ── Update stats counters ──
function updateStats(problems) {
  const easy   = problems.filter(p => p.difficulty === 'Easy').length;
  const medium = problems.filter(p => p.difficulty === 'Medium').length;
  const hard   = problems.filter(p => p.difficulty === 'Hard').length;

  const el = id => document.getElementById(id);
  if (el('stat-total'))  el('stat-total').textContent  = problems.length;
  if (el('stat-easy'))   el('stat-easy').textContent   = easy;
  if (el('stat-medium')) el('stat-medium').textContent = medium;
  if (el('stat-hard'))   el('stat-hard').textContent   = hard;
}

// ── Init problems page ──
async function initProblemsPage() {
  allProblems = await fetchProblems();
  updateStats(allProblems);

  const user = getCurrentUser();
  let solvedIds = [];
  if (user) {
    solvedIds = await getSolvedProblems(user.uid);
    if (document.getElementById('stat-solved'))
      document.getElementById('stat-solved').textContent = solvedIds.length;
  }

  renderProblems(allProblems, solvedIds);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderProblems(allProblems, solvedIds);
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value;
      renderProblems(allProblems, solvedIds);
    });
  }
}
