import { Member } from "@/types/research";
import { GraduationCap } from "lucide-react";

interface Props {
    member: Member;
    activeTab: string;
}

export default function MemberDetails({ member, activeTab }: Props) {
    const Container = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="py-2">
            <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {title}
            </h4>
            {children}
        </div>
    );

    if (activeTab === 'education') {
        return (
            <Container title="Educational Attainment">
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-gray-50 dark:bg-gray-700 p-2">
                        <GraduationCap className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                            {member.educational_attainment || <span className="text-gray-500 dark:text-gray-400 italic">Not specified</span>}
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                            <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Program:</span> {member.member_program}
                        </p>
                    </div>
                </div>
            </Container>
        );
    }

    if (activeTab === 'specialization') {
        return (
            <Container title="Field of Specialization">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {member.specialization || <span className="text-gray-500 dark:text-gray-400 italic">No specialization listed.</span>}
                </p>
            </Container>
        );
    }

    if (activeTab === 'research_interest') {
        return (
            <Container title="Research Interests">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {member.research_interest || <span className="text-gray-500 dark:text-gray-400 italic">No research interests listed.</span>}
                </p>
            </Container>
        );
    }

    return null;
}
