import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ResearchFilterData } from "@/types/filters";

interface ResearchFiltersProps {
  filters: ResearchFilterData;
  setFilters: (filters: ResearchFilterData) => void;
  onFilter: (filters: ResearchFilterData) => void;
}

export default function ResearchFilters({
  filters,
  setFilters,
  onFilter,
}: ResearchFiltersProps) {

  const [localFilters, setLocalFilters] = useState<ResearchFilterData>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    setFilters(localFilters);
    onFilter(localFilters);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalFilters(filters);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-4 bg-white dark:bg-gray-800 rounded-md shadow-2xl border border-gray-200 hover:shadow-2xl transition-shadow duration-200">
        <h2 className="text-lg font-semibold">Filters</h2>

        {/* TYPE */}
        <div className="space-y-1">
          <label className="text-sm font-small">Type</label>
          <Select
            value={localFilters.type}
            onValueChange={(val: ResearchFilterData["type"]) =>
              setLocalFilters({ ...localFilters, type: val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="program">Program</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="study">Study</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PROGRAM */}
        <div className="space-y-1">
          <label className="text-sm font-small">Program</label>
          <Select
            value={localFilters.program}
            onValueChange={(val) =>
              setLocalFilters({ ...localFilters, program: val as ResearchFilterData["program"] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Programs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All Programs</SelectItem>
              <SelectItem value="BSIT">BSIT</SelectItem>
              <SelectItem value="BLIS">BLIS</SelectItem>
              <SelectItem value="BSCS">BSCS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* YEAR */}
        <div className="space-y-1">
          <label className="text-sm font-small">Year Completed</label>
          <Input
            type="number"
            placeholder="YYYY"
            value={localFilters.year_completed ?? ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                year_completed: e.target.value ? String(e.target.value) : "",
              })
            }
          />
        </div>

        {/* STATUS */}
        <div className="space-y-2">
          <label className="text-sm font-small">Status</label>
          <div className="flex flex-wrap gap-3">
            {["ongoing", "completed", "terminated"].map((status) => (
              <div key={status} className="flex items-center gap-1 text-sm font-small">
                <Checkbox
                  checked={localFilters.status === status}
                  onCheckedChange={() =>
                    setLocalFilters({
                      ...localFilters,
                      status: localFilters.status === status ? "" : (status as ResearchFilterData["status"]),
                    })
                  }
                />
                <span className="capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* BUTTONS */}
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
