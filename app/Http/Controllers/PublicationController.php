<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Publication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Publication::with('members');

        // Filter by program
        if ($request->filled('publication_program') && $request->publication_program !== 'any') {
            $query->where('publication_program', $request->publication_program);
        }

        // Filter by year range
        if ($request->filled('year_from')) {
            $query->where('publication_year', '>=', $request->year_from);
        }
        if ($request->filled('year_to')) {
            $query->where('publication_year', '<=', $request->year_to);
        }

        // Search
        if ($request->filled('search')) {
            $query->where('publication_title', 'like', '%' . $request->search . '%');
        }

        // Sort
        if ($request->filled('sort') && $request->sort !== 'default') {
            $query->orderBy('publication_title', $request->sort === 'asc' ? 'asc' : 'desc');
        }
        $query->orderByDesc('id');
        $publications = $query->paginate(10)->withQueryString();

        $members = Member::all();

        return Inertia::render('Publications/Index', [
            'publications' => $publications,
            'members' => $members,
            'filters' => $request->only(['publication_program', 'year_from', 'year_to', 'sort', 'search']),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'publication_title'     => 'required|string|max:255',
            'journal'               => 'required|string|max:255',
            'publication_year'      => 'required|digits:4',
            'publication_program'   => 'nullable|in:BSIT,BLIS,BSCS',
            'isbn'                  => 'nullable|string|max:16',
            'p-issn'                => 'nullable|string|max:16',
            'e-issn'                => 'nullable|string|max:16',
            'publisher'             => 'required|string|max:120',
            'online_view'           => 'required|string|max:255',
            'incentive_file'        => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'product_file'          => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'patent_file'           => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            // Publication Members
            'member_ids'            => 'nullable|array',
            'member_ids.*'          => 'exists:members,id',
        ]);

        if ($request->hasFile('incentive_file')) {
            $file = $request->file('incentive_file');
            $validated['incentive_file'] = $request->file('incentive_file')->storeAs('publications/documents', $file->getClientOriginalName(), 'public');
        }

        if ($request->hasFile('product_file')) {
            $file = $request->file('product_file');
            $validated['product_file'] = $request->file('product_file')->storeAs('publications/documents', $file->getClientOriginalName(), 'public');
        }

        if ($request->hasFile('patent_file')) {
            $file = $request->file('patent_file');
            $validated['patent_file'] = $request->file('patent_file')->storeAs('publications/documents', $file->getClientOriginalName(), 'public');
        }

        $publication = Publication::create($validated);

        // Sync authors
        if ($request->has('member_ids')) {
            $publication->members()->sync($request->input('member_ids', []));
        }

        return redirect()->route('publications.index')->with('message', 'Research Publication added successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Publication $publication)
    {
        $validated = $request->validate([
            'publication_title'     => 'required|string|max:255',
            'journal'               => 'required|string|max:255',
            'publication_year'      => 'required|digits:4',
            'publication_program'   => 'nullable|in:BSIT,BLIS,BSCS',
            'isbn'                  => 'nullable|string|max:16',
            'p-issn'                => 'nullable|string|max:16',
            'e-issn'                => 'nullable|string|max:16',
            'publisher'             => 'required|string|max:120',
            'online_view'           => 'required|string|max:255',
            'incentive_file'        => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'product_file'          => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'patent_file'           => 'nullable|file|mimes:pdf,doc,docx|max:10240',

            // Publication Members
            'member_ids'            => 'nullable|array',
            'member_ids.*'          => 'exists:members,id',
        ]);

        // incentive_file
        if (!$request->hasFile('incentive_file')) {
            unset($validated['incentive_file']);
        }

        if ($request->hasFile('incentive_file')) {
            if ($publication->incentive_file) {
                Storage::disk('public')->delete($publication->incentive_file);
            }
            $file = $request->file('incentive_file');
            $validated['incentive_file'] = $request->file('incentive_file')->storeAs('publications/documents', $file->getClientOriginalName(), 'public');
        }

        // product_file
        if (!$request->hasFile('product_file')) {
            unset($validated['product_file']);
        }

        if ($request->hasFile('product_file')) {
            if ($publication->product_file) {
                Storage::disk('public')->delete($publication->product_file);
            }
            $file = $request->file('product_file');
            $validated['product_file'] = $request->file('product_file')->storeAs('publications/documents', $file->getClientOriginalName(), 'public');
        }

        // patent_file
        if (!$request->hasFile('patent_file')) {
            unset($validated['patent_file']);
        }

        if ($request->hasFile('patent_file')) {
            if ($publication->patent_file) {
                Storage::disk('public')->delete($publication->patent_file);
            }
            $file = $request->file('patent_file');
            $validated['patent_file'] = $request->file('patent_file')->storeAs('publications/documents', $file->getClientOriginalName(), 'public');
        }

        // update
        $publication->update($validated);

        // sync authors
        if ($request->has('member_ids')) {
            $publication->members()->sync($request->input('member_ids', []));
        }

        return redirect()->route('publications.index')->with('message', 'Research Publication updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Publication $publication)
    {
        $publication->delete();
        return redirect()->route('publications.index')->with('message', 'Research Publication deleted successfully');
    }
}
