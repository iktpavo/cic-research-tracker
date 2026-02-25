<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Utilization extends Model
{
    use HasFactory;
    // Allow mass assignment for these fields
    protected $fillable = [
        'research_id',
        'beneficiary',
        'cert_date',
        'certificate_of_utilization',
    ];

    //  relationship to research
    public function research()
    {
        return $this->belongsTo(Research::class, 'research_id');
    }

    public static function getTotalUtilizationsCount()
    {
        return self::count();
    }

    // Utilization belong to bsit
    public function getProgramIsBsitAttribute()
    {
        return $this->research?->program === 'BSIT' ? 1 : 0;
    }

    // Utilization belong to bsit
    public function getProgramIsBlisAttribute()
    {
        return $this->research?->program === 'BLIS' ? 1 : 0;
    }

    // Utilization belong to bscs
    public function getProgramIsBscsAttribute()
    {
        return $this->research?->program === 'BSCS' ? 1 : 0;
    }

    //total count
    public static function getUtilizationProgramTotals()
    {
        $all = self::with('research')->get();

        return [
            'bsit' => $all->sum->program_is_bsit,
            'blis' => $all->sum->program_is_blis,
            'bscs' => $all->sum->program_is_bscs,
        ];
    }
}
