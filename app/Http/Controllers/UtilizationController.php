<?php

namespace App\Http\Controllers;

use App\Models\Utilization;
use App\Models\Research;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UtilizationController extends Controller
{
    public function index(Request $request)
    {
        $query = Utilization::with('research')
            ->select('utilizations.*');

        // search functionality - search in beneficiary and research title
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('beneficiary', 'like', "%{$searchTerm}%")
                    ->orWhereHas('research', function ($subQuery) use ($searchTerm) {
                        $subQuery->where('research_title', 'like', "%{$searchTerm}%");
                    });
            });
        }

        // filter by certificate date range
        if ($request->filled('date_from')) {
            $query->where('cert_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('cert_date', '<=', $request->date_to);
        }

        // sort by research title
        if ($request->filled('sort') && $request->sort !== 'default') {
            $query->orderBy(
                Research::select('research_title')
                    ->whereColumn('research.id', 'utilizations.research_id'),
                $request->sort === 'asc' ? 'asc' : 'desc'
            );
        }
        $query->orderByDesc('id');

        $utilizations = $query->paginate(10)->withQueryString();

        // Transform collection for frontend
        $utilizations->getCollection()->transform(function ($u) {
            return [
                'id' => $u->id,
                'research_id' => $u->research_id,
                'research_title' => $u->research?->research_title ?? null,
                'beneficiary' => $u->beneficiary,
                'cert_date' => $u->cert_date,
                'certificate_of_utilization' => $u->certificate_of_utilization,
                'bsit' => $u->program_is_bsit,
                'blis' => $u->program_is_blis,
                'bscs' => $u->program_is_bscs,
            ];
        });



        // Fetch researches for create/edit dropdown
        $researches = Research::select('id', 'research_title')->get();

        return Inertia::render('Utilizations/Index', [
            'utilizations' => $utilizations,
            'researches' => $researches,
            'filters' => $request->only(['search', 'date_from', 'date_to', 'sort']),
            'totalUtilizations' => Utilization::getTotalUtilizationsCount(),
            'programTotals' => Utilization::getUtilizationProgramTotals(),
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'research_id' => 'required|exists:research,id|unique:utilizations,research_id',
            'beneficiary' => 'required|string|max:255',
            'cert_date' => 'required|date',
            'certificate_of_utilization' => 'nullable|file|max:50000',
        ]);

        if ($request->hasFile('certificate_of_utilization')) {
            $file = $request->file('certificate_of_utilization');

            $validated['certificate_of_utilization'] = $file->storeAs(
                'utilizations/files',
                $file->getClientOriginalName(),
                'public'
            );
        }

        Utilization::create($validated);

        return redirect()->back()->with('message', 'Utilization added successfully.');
    }

    public function update(Request $request, Utilization $utilization)
    {
        $validated = $request->validate([
            'research_id' => 'required|exists:research,id',
            'beneficiary' => 'required|string|max:255',
            'cert_date' => 'required|date',
            'certificate_of_utilization' => 'nullable|file|max:50000',
        ]);

        if ($request->hasFile('certificate_of_utilization')) {

            if ($utilization->certificate_of_utilization) {
                Storage::disk('public')->delete($utilization->certificate_of_utilization);
            }

            $file = $request->file('certificate_of_utilization');

            $validated['certificate_of_utilization'] = $file->storeAs(
                'utilizations/files',
                $file->getClientOriginalName(),
                'public'
            );
        }

        $utilization->update($validated);

        return redirect()->back()->with('message', 'Utilization updated successfully.');
    }

    public function destroy($id)
    {
        $util = Utilization::findOrFail($id);

        // Delete the stored file
        if ($util->certificate_of_utilization) {
            Storage::disk('public')->delete($util->certificate_of_utilization);
        }

        // Delete database row
        $util->delete();

        return redirect()->route('utilizations.index')
            ->with('message', 'Utilization deleted successfully.');
    }
}
