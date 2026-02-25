<?php

namespace App\Http\Controllers;

use App\Models\Research;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProposalController extends Controller
{
    public function index(Request $request)
    {
        $query = Research::select([
            'id',
            'program',
            'research_title',
            'start_date',
            'duration',
            'year_completed',
            'completion_percentage',
            'estimated_budget',
            'budget_utilized',
            'special_order',
            'terminal_report'
        ]);

        // Server-side search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('research_title', 'like', '%' . $request->search . '%')
                    ->orWhere('start_date', 'like', '%' . $request->search . '%')
                    ->orWhere('completion_percentage', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by program
        if ($request->program && $request->program !== 'any') {
            $query->where('program', $request->program);
        }

        // Filter by year_completed
        if ($request->year_completed && $request->year_completed !== 'any') {
            $query->where('year_completed', $request->year_completed);
        }

        // sorting
        if ($request->sort) {
            if ($request->sort === 'asc') {
                $query->orderBy('research_title', 'asc');
            } elseif ($request->sort === 'desc') {
                $query->orderBy('research_title', 'desc');
            }
        } else {
            $query->orderByDesc('id'); // default order
        }

        $proposals = $query->paginate(10)->withQueryString();

        return Inertia::render('Proposals/Index', [
            'proposals'     => $proposals,
            'search'        => $request->search ?? '',
            'programFilter' => $request->program ?? '',
            'yearFilter'    => $request->year_completed ?? '',
        ]);
    }
}
