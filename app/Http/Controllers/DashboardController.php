<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Publication;
use App\Models\Research;
use App\Models\Team;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $program = $request->query('program', 'all');
        $year = $request->query('year', 'all');

        $researchQuery = Research::query();
        $publicationQuery = Publication::query();

        if ($program !== 'all') {
            $researchQuery->where('program', $program);
            $publicationQuery->where('publication_program', $program);
        }

        // --- Yearly trend aggregations
        $startYear = now()->year - 10; // last 5 years
        $endYear = now()->year;

        $yearRange = range($startYear, $endYear);

        // Base queries
        $researchBase = Research::query();
        $publicationBase = Publication::query();

        if ($program !== 'all') {
            $researchBase->where('program', $program);
            $publicationBase->where('publication_program', $program);
        }

        // Fetch completed research per year
        $completedResearchByYear = $researchBase
            ->whereNotNull('year_completed')
            ->selectRaw('year_completed as year, COUNT(*) as total')
            ->groupBy('year')
            ->pluck('total', 'year');

        // Fetch publications per year
        $publicationsByYear = $publicationBase
            ->whereNotNull('publication_year')
            ->selectRaw('publication_year as year, COUNT(*) as total')
            ->groupBy('year')
            ->pluck('total', 'year');

        // Combine into consistent array
        $yearlyTrends = [];
        foreach ($yearRange as $year) {
            $yearlyTrends[] = [
                'year' => $year,
                'publications' => $publicationsByYear[$year] ?? 0,
                'completed' => $completedResearchByYear[$year] ?? 0,
            ];
        }
        // --- End of yearly trend aggregations

        return inertia('dashboard', [
            'counts' => [
                'ongoing' => $researchQuery->clone()->where('status', 'ongoing')->count(),
                'completed' => $researchQuery->clone()->where('status', 'completed')->count(),
                'publications' => $publicationQuery->count(),
            ],
            'filters' => [
                'program' => $program,
                'year' => $year,
            ],
            'programOptions' => [
                'all',
                'BSIT',
                'BLIS',
                'BSCS'
            ],
            'yearlyTrends' => $yearlyTrends,
        ]);
    }
}
