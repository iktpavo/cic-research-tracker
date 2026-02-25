<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Research;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Member::with('research', 'publication',);

        // Rank filter
        if ($request->filled('rank') && $request->rank !== 'any') {
            $query->where('rank', $request->rank);
        }

        // Program filter
        if ($request->filled('member_program') && $request->member_program !== 'any') {
            $query->where('member_program', $request->member_program);
        }

        if ($request->filled('sort') && $request->sort !== '') {
            $query->orderBy('full_name', $request->sort === 'desc' ? 'desc' : 'asc');
        }
        // Search
        if ($request->filled('search')) {
            $query->where('full_name', 'like', '%' . $request->search . '%');
        }
        // Teaches grad school filter
        if ($request->filled('teaches_grad_school') && in_array($request->teaches_grad_school, ['1', '0'])) {
            $query->where('teaches_grad_school', $request->teaches_grad_school);
        }

        $query->orderByDesc('id');

        $members = $query->paginate(10)->withQueryString()->through(function ($member) {
            return [
                'id' => $member->id,
                'full_name' => $member->full_name,
                'rank' => $member->rank,
                'designation' => $member->designation,
                'member_program' => $member->member_program,
                'member_email' => $member->member_email,
                'orcid' => $member->orcid,
                'telephone' => $member->telephone,
                'profile_photo' => $member->profile_photo,
                'educational_attainment' => $member->educational_attainment,
                'specialization' => $member->specialization,
                'research_interest' => $member->research_interest,
                'teaches_grad_school' => $member->teaches_grad_school,
                'ongoing' => $member->ongoing_research_count,
                'completed' => $member->completed_research_count,
                'publication_count' => $member->publication_count,
            ];
        });

        return Inertia::render('Members/Index', [
            'members' => $members,
            'filters' => $request->only(['rank', 'member_program', 'sort', 'search', 'teaches_grad_school']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'                 => 'required|string|max:48',
            'rank'                      => 'required|in:Professor,Assistant Professor,Associate Professor,Instructor,Technical Staff,Administrative Aide,Technician,Student,Alumnus,Alumna,Other',
            'designation'               => 'nullable|string|max:255',
            'member_program'            => 'nullable|in:BSIT,BLIS,BSCS',
            'member_email'              => 'nullable|email|max:120|unique:members,member_email',
            'orcid'                     => 'nullable|string|max:32',
            'telephone'                 => 'nullable|string|max:24',
            'educational_attainment'    => 'nullable|string',
            'specialization'            => 'nullable|string',
            'research_interest'         => 'nullable|string',
            'profile_photo'             => 'nullable|image|max:2048',
            'teaches_grad_school'       => 'boolean',
        ]);

        $data = $validated;

        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $request->file('profile_photo')->store('members/picture', 'public');
        }

        Member::create($data);
        return redirect()->route('members.index')->with('message', 'Member added sucessfully!');
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
    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'full_name'                 => 'required|string|max:48',
            'rank'                      => 'required|in:Professor,Assistant Professor,Associate Professor,Instructor,Technical Staff,Administrative Aide,Technician,Student,Alumnus,Alumna,Other',
            'designation'               => 'nullable|string|max:255',
            'member_program'            => 'nullable|in:BSIT,BLIS,BSCS',
            'member_email'  => [
                'nullable',
                'email',
                'max:120',
                Rule::unique('members', 'email')->ignore($member->id),
            ],
            'orcid'                     => 'nullable|string|max:32',
            'telephone'                 => 'nullable|string|max:24',
            'educational_attainment'    => 'nullable|string',
            'specialization'            => 'nullable|string',
            'research_interest'         => 'nullable|string',
            'profile_photo'             => 'nullable|image|max:2048',
            'teaches_grad_school'       => 'boolean',
        ]);

        $data = $validated;
        // delete existing if updating
        if ($request->hasFile('profile_photo')) {

            if ($member->profile_photo) {
                Storage::disk('public')->delete($member->profile_photo);
            }
            // upload new
            $data['profile_photo'] = $request->file('profile_photo')->store('members/picture', 'public');
        } else {
            // keep old
            $data['profile_photo'] = $member->profile_photo;
        }

        $member->update($data);

        return redirect()->route('members.index')->with('message', 'Member updated Sucessfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        $member->delete();

        return redirect()->route('members.index')->with('message', 'Profile deleted successfully');
    }
}
