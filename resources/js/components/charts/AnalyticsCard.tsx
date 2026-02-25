import { TrendingDown, TrendingUp, Minus, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface SectionCardsProps {
  totalLogins: number;
  totalLoginsPrev?: number;
  activeToday: number;

  newThisWeek: number;
  newThisWeekPrev?: number;

}

export function SectionCards({
  totalLogins,
  totalLoginsPrev = 0,
  activeToday,
  newThisWeek,
  newThisWeekPrev = 0,

}: SectionCardsProps) {
  const cards = [
    { title: "Total Logins This Month", value: totalLogins, prevValue: totalLoginsPrev, description: "Total logins recorded", trendText: "Trending this month" },
    { title: "Active Today", value: activeToday, description: "Active sessions", trendText: "Online users today", noTrend: true },
    { title: "New Users This Week", value: newThisWeek, prevValue: newThisWeekPrev, description: "User registrations this week", trendText: "New registrations" },

  ];

  const getTrendIcon = (value: number, prevValue?: number) => {
    if (!prevValue || prevValue === 0) return <Minus className="w-4 h-4 text-gray-400" />;
    if (value > prevValue) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < prevValue) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendPercent = (value: number, prevValue?: number) => {
    if (!prevValue || prevValue === 0) {
      // If no previous data, return 0% instead of 100%
      return 0;
    }
    return Math.round(((value - prevValue) / prevValue) * 100);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {cards.map((card, idx) => {
        const trendPercent = getTrendPercent(card.value, card.prevValue);
        return (
          <Card key={idx} className="h-44 flex flex-col justify-center border border-grey/20 dark:border-white/20 shadow-sm text-sm">
            <CardHeader className="flex flex-col gap-2 pl-4 pr-3 pt-5 pb-2">
              <div className="flex justify-between items-start">
                <CardDescription className="text-left text-sm">{card.title}</CardDescription>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {card.noTrend ? (
                    <>

                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-100">
                        <Users className="w-5 h-5 text-green-500" />
                      </span>
                    </>
                  ) : (
                    <>
                      {getTrendIcon(card.value, card.prevValue)}
                      <span>{`${trendPercent}%`}</span>
                    </>
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold tabular-nums">{card.value}</CardTitle>
            </CardHeader>
            <CardFooter className="flex flex-col gap-1 items-start text-left pl-4 pr-3 pb-4">
              <div className="flex items-center gap-1 font-medium text-xs">{card.trendText}</div>
              <div className="text-muted-foreground text-xs">{card.description}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
