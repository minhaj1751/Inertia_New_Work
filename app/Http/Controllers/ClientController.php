<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ClientController extends Controller
{
    public function index()
    {
        $categoryData = Category::latest()->get();
        $clientData = Client::latest()->get();
        return Inertia::render('Client/Index', [
            'categoryData' => $categoryData,
            'clientData' => $clientData,
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required',
            'client_name' => 'required',
            'client_phone' => 'required|min:11|max:11',
            'image' => 'nullable|image|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('clientImage', 'public');
        }

        Client::create([
            'category_id' => $request->category_id,
            'client_name' => $request->client_name,
            'client_phone' => $request->client_phone,
            'image' => $imagePath,
        ]);

        return redirect()->route('client.index');
    }

    public function edit(Client $client)
    {
        //
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'category_id' => 'required',
            'client_name' => 'required',
            'client_phone' => 'required|min:11|max:11',
            'image' => 'nullable|image|max:2048'
        ]);

        $singlePData = Client::findOrFail($id);

        $imagePath = $singlePData->image;
        if ($request->hasFile('image')) {
            if ($singlePData->image) {
                Storage::disk('public')->delete($singlePData->image);
            }
            $imagePath = $request->file('image')->store('clientImage', 'public');
        }

        $singlePData->update([
            'category_id' => $request->category_id,
            'client_name' => $request->client_name,
            'client_name' => $request->client_name,
            'client_phone' => $request->client_phone,
            'image' => $imagePath,
        ]);

        return redirect()->route('client.index');
    }

    public function destroy(Client $client)
    {
        if ($client->image) {
            Storage::disk('public')->delete($client->image);
        }
        $client->delete();

        $categoryData = Category::latest()->get();
        $clientData = Client::latest()->get();
        return Inertia::render('Client/Index', [
            'categoryData' => $categoryData,
            'clientData' => $clientData,
        ]);
    }
}
