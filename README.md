# Excel Sheet Clone (10,000 x 10,000)

A high-performance Excel clone built using **React 19**, **Vite**, **Tailwind CSS**, and **mathjs**, designed to handle a 10,000 x 10,000 editable grid with formula support, real-time updates, and smooth keyboard navigation.

---

## 🚀 Features

### ✅ Cell Editing

- Click or double-click any cell to edit
- Values persist after editing
- Differentiates between formulas (`=A1+B1`) and raw values (`123`)

### ✅ Formula Support

- Supports basic formulas like `=A1+B1`, `=A1*B1+C1`, etc.
- Dynamic dependency tracking: when referenced cells change, dependent cells update automatically
- Circular reference detection to prevent infinite loops
- Built-in formula parsing using `mathjs`

### ✅ Keyboard Navigation

- Arrow Keys: Move between cells
- Tab / Shift+Tab: Navigate horizontally
- Enter: Begin editing or confirm input and move vertically

### ✅ Performance

- Virtualized rendering for handling a 10,000 x 10,000 grid efficiently
- Smooth scrolling and fast updates even with large datasets

### ✅ Debug Panel (Dev Mode)

- View internal state and cell dependencies for debugging formulas and updates

---

## 🧪 How to Test

### Basic Data Entry

1. Click on any cell and type a number or text
2. Click elsewhere and verify the value persists
3. Double-click to edit an existing value

### Formula Evaluation

1. Enter `10` in **A1**
2. Enter `20` in **B1**
3. Enter `=A1+B1` in **C1** → Should display `30`
4. Change A1 to `15` → C1 should automatically update to `35`

### Keyboard Navigation

- Use Arrow Keys to navigate
- Use **Tab** to move right, **Shift+Tab** to move left
- Press **Enter** to edit; press **Enter** again to confirm and move down

### Advanced Testing

- Try formulas like `=A1*B1+C1`
- Try `=SUM(A1:A5)` if SUM is implemented
- Enter circular references (e.g., `=B1` in A1 and `=A1` in B1) to test error handling

### Large Data Testing

- Enter data in distant cells like `Z100`, `AZ1000`, etc.
- Scroll and navigate to test rendering and performance

---

## 🛠 Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS**
- **mathjs** – for parsing and evaluating formulas

---

## 📦 Getting Started

### Clone and Install

```bash
git clone <my-repo-url>
cd excel-clone
npm install
```
