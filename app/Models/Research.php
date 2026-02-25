<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Research extends Model
{
    use HasFactory;
    protected $fillable = [
        'research_title',
        'funding_source',
        'collaborating_agency',
        'type',
        'program',
        'team_leader',
        'status',
        // Proposal Fields
        'start_date',
        'duration',
        'estimated_budget',
        'special_order',
        // Monitoring Fields
        'budget_utilized',
        'completion_percentage',
        'terminal_report',
        'year_completed',
        // Dost6ps
        'publication',
        'patent',
        'product',
        'people_service',
        'place_and_partnership',
        'policy',

    ];

    protected $casts = [
        'start_date' => 'date',
        'estimated_budget' => 'decimal:2',
        'budget_utilized' => 'decimal:2',
        'completion_percentage' => 'integer',
    ];


    // Get the members that belong to this research.
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'teams')->withTimestamps();
    }

    public function utilization()
    {
        return $this->hasOne(Utilization::class, 'research_id');
    }
}
