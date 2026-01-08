<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        $categoryData = Category::latest()->get();
        return Inertia::render('Category/Index', [
            'categoryData' => $categoryData
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required',
            'image' => 'nullable|image|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categoryImage', 'public');
        }

        Category::create([
            'category_name' => $request->category_name,
            'image' => $imagePath,
        ]);

        return redirect()->route('category.index');
    }

    public function edit(Category $category)
    {
        //
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'category_name' => 'required',
            'image' => 'nullable|image|max:2048'
        ]);

        $singlePData = Category::findOrFail($id);

        $imagePath = $singlePData->image;
        if ($request->hasFile('image')) {
            if ($singlePData->image) {
                Storage::disk('public')->delete($singlePData->image);
            }
            $imagePath = $request->file('image')->store('categoryImage', 'public');
        }

        $singlePData->update([
            'category_name' => $request->category_name,
            'image' => $imagePath,
        ]);

        return redirect()->route('category.index');
    }

    public function destroy(Category $category)
    {
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }
        $category->delete();

        return Inertia::render('Category/Index', [
            'categoryData' => Category::latest()->get()
        ]);
    }
}
