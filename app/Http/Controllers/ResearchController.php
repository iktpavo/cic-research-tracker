<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Research;
use App\Models\Member;

class ResearchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Research::with('members');

        // Apply filters if any
        if ($request->type && $request->type !== 'any') {
            $query->where('type', $request->type);
        }
        if ($request->status && $request->status !== 'any') {
            $query->where('status', $request->status);
        }
        if ($request->year_completed && $request->year_completed !== 'any') {
            $query->where('year_completed', $request->year_completed);
        }
        if ($request->program && $request->program !== 'any') {
            $query->where('program', $request->program);
        }
        $query->orderbyDesc('id');

        // Server-side search 
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('research_title', 'like', '%' . $request->search . '%')
                    ->orWhere('collaborating_agency', 'like', '%' . $request->search . '%')
                    ->orWhere('funding_source', 'like', '%' . $request->search . '%');
            });
        }

        $research = $query->paginate(10)->withQueryString(); // keeps filters & search in pagination

        return Inertia::render('Research/Index', [
            'research' => $research,
            'members'  => Member::all(),
            'filters'  => $request->only([
                'type',
                'status',
                'year_completed',
                'program',
                'search'
            ]),
            'programs' => ['BSIT', 'BLIS', 'BSCS'],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //  return Inertia::render('Research/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'research_title'            => 'required|string|max:255',
            'funding_source'            => 'nullable|string|max:255',
            'collaborating_agency'      => 'nullable|string|max:255',
            'type'                      => 'required|in:study,program,project',
            'program'                   => 'required|in:BSIT,BLIS,BSCS',
            'status'                    => 'required|in:completed,ongoing,terminated',
            // Proposal Fields
            'start_date'                => 'nullable|date',
            'duration'                  => 'nullable|string|max:255',
            'estimated_budget'          => 'nullable|numeric|min:0',
            'special_order'             => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            // Monitoring Fields
            'budget_utilized'           => 'nullable|numeric|min:0',
            'completion_percentage'     => 'nullable|integer|min:0|max:100',
            'terminal_report'           => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'year_completed'            => 'nullable|string|max:120',
            // DOST6ps
            'publication'               => 'nullable|string',
            'patent'                    => 'nullable|string',
            'product'                   => 'nullable|string',
            'people_service'            => 'nullable|string',
            'place_and_partnership'     => 'nullable|string',
            'policy'                    => 'nullable|string',
            // Team Members
            'member_ids'                => 'nullable|array',
            'member_ids.*'              => 'exists:members,id',
        ]);

        // Handle file uploads
        if ($request->hasFile('special_order')) {
            $file = $request->file('special_order');    //store as original fileName
            $validated['special_order'] = $request->file('special_order')->storeAs('research/documents', $file->getClientOriginalName(), 'public');
        }

        if ($request->hasFile('terminal_report')) {
            $file = $request->file('terminal_report'); //store as original fileName
            $validated['terminal_report'] = $request->file('terminal_report')->storeAs('research/documents', $file->getClientOriginalName(), 'public');
        }

        // Create research
        $research = Research::create($validated);

        // Sync team members
        if ($request->has('member_ids')) {
            $research->members()->sync($request->input('member_ids', []));
        }

        return redirect()->route('research.index')->with('message', 'Research added successfully');
    }

    /**
     * Method for showing the specific research (different page)
     */
    public function show(Research $research)
    {
        $research->load('members');
        return Inertia::render('Research/Show', ['research' => $research,]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Research $research)
    {
        // $research->load('members');
        // $members = Member::all();
        // return Inertia::render('Research/Edit', compact('research', 'members'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Research $research)
    {
        $validated = $request->validate([
            'research_title'                => 'required|string|max:255',
            'funding_source'                => 'nullable|string|max:255',
            'collaborating_agency'          => 'nullable|string|max:255',
            'type'                          => 'required|in:study,program,project',
            'program'                       => 'required|in:BSIT,BLIS,BSCS',
            'status'                        => 'required|in:completed,ongoing,terminated',
            // Proposal Fields
            'start_date'                    => 'nullable|date',
            'duration'                      => 'nullable|string|max:255',
            'estimated_budget'              => 'nullable|numeric|min:0',
            'special_order'                 => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            // Monitoring Fields
            'budget_utilized'               => 'nullable|numeric|min:0',
            'completion_percentage'         => 'nullable|integer|min:0|max:100',
            'terminal_report'               => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'year_completed'                => 'nullable|string|max:120',
            // DOST6ps
            'publication'                   => 'nullable|string',
            'patent'                        => 'nullable|string',
            'product'                       => 'nullable|string',
            'people_service'                => 'nullable|string',
            'place_and_partnership'         => 'nullable|string',
            'policy'                        => 'nullable|string',
            // Team Members
            'member_ids'                    => 'nullable|array',
            'member_ids.*'                  => 'exists:members,id',
        ]);

        /// prevent files from being overwritten 
        if (!$request->hasFile('special_order')) {
            unset($validated['special_order']);
        }

        if (!$request->hasFile('terminal_report')) {
            unset($validated['terminal_report']);
        }

        // Handle file uploads (only if new file is provided)
        if ($request->hasFile('special_order')) {
            // Delete old file if exists
            if ($research->special_order) {
                Storage::disk('public')->delete($research->special_order);
            }
            $file = $request->file('special_order');    //store as original fileName
            $validated['special_order'] = $request->file('special_order')->storeAs('research/documents', $file->getClientOriginalName(), 'public');
        }

        if ($request->hasFile('terminal_report')) {
            // Delete old file if exists
            if ($research->terminal_report) {
                Storage::disk('public')->delete($research->terminal_report);
            }
            $file = $request->file('terminal_report');   // store as original fileName
            $validated['terminal_report'] = $request->file('terminal_report')->storeAs('research/documents', $file->getClientOriginalName(), 'public');
        }

        // Update research
        $research->update($validated);

        // Sync team members
        if ($request->has('member_ids')) {
            $research->members()->sync($request->input('member_ids', []));
        }

        return redirect()->route('research.index')->with('message', 'Research updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Research $research)
    {
        $research->delete();
        return redirect()->route('research.index')->with('message', 'Research deleted successfully!');
    }
}
