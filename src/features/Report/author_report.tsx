import { useMemo, useState } from 'react';
import { 
    isSameDay, 
    isSameMonth, 
    isSameYear, 
} from 'date-fns';
import { useAuthorReportQuery } from '../../composable/Query/Report/useAuthorReportQuery';
import { decryptAuthData } from '../../lib/helper';
import type { ReportFilters } from '../../types/response/report/authorReportResponse';
import { AuthorReportComponent } from '../../components/Report/Author/author_report_component';
import ReportCard from '../../components/common/report_card';
import { Wallet } from 'lucide-react';

export default function AuthorReport() {
    const [filters, setFilters] = useState<ReportFilters>({
        category: "All", 
        startDate: "", 
        endDate: ""    
    });

    const loginUser = decryptAuthData(localStorage.getItem("creator")!);
    const authorId = loginUser?.creator?.id;

    const { authorReportList, isLoading } = useAuthorReportQuery({ 
        authorId: authorId!, 
        startDate: filters.startDate, 
        endDate: filters.endDate 
    });

    // Flatten Table Data
    const tableData = useMemo(() => {
        const reports = authorReportList?.data?.reports;
        if (!reports) return [];

        if (filters.category === "All") {
            return Object.values(reports).flat(); 
        }

        const selectedCategory = filters.category.toLowerCase();
        const categoryMapping: Record<string, string[]> = {
            magazine: ["magazine", "journal"],
            journal: ["journal", "magazine"],
            novel: ["novel"],
            gallery: ["gallery"]
        };

        const keysToCheck = categoryMapping[selectedCategory] || [selectedCategory];
        const apiKeys = Object.keys(reports);
        
        for (const target of keysToCheck) {
            const foundKey = apiKeys.find(k => k.toLowerCase() === target);
            if (foundKey && reports[foundKey].length > 0) {
                return reports[foundKey];
            }
        }
        return [];
    }, [authorReportList, filters.category]);

    // Manual Calculation based on your API response keys
    const stats = useMemo(() => {
        const now = new Date();
        
        return tableData.reduce((acc, item) => {
            // Mapping keys: authorIncome and purchaseDate
            const income = Number(item.authorIncome) || 0;
            
            // new Date("26 Nov 2025") works natively in most browsers
            const itemDate = new Date(item.purchaseDate);

            // Safety check for valid date
            if (!isNaN(itemDate.getTime())) {
                // Total (based on current table data/filters)
                acc.totalIncome += income;

                // Yearly (Current Year)
                if (isSameYear(itemDate, now)) {
                    acc.yearlyIncome += income;
                }

                // Monthly (Current Month)
                if (isSameMonth(itemDate, now)) {
                    acc.monthlyIncome += income;
                }

                // Daily (Today)
                if (isSameDay(itemDate, now)) {
                    acc.dailyIncome += income;
                }
            }

            return acc;
        }, {
            totalIncome: 0,
            yearlyIncome: 0,
            monthlyIncome: 0,
            dailyIncome: 0
        });
    }, [tableData]);

    const handleFiltersChange = (updates: Partial<ReportFilters>) => {
        setFilters(prev => ({ ...prev, ...updates }));
    };

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear().toString();
    const currentDay = new Date().toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
    return (
        <div className="p-8 space-y-8">
            {/* Dynamic Status Cards */}
            <div className="border border-dashed rounded-xl p-6 bg-card/50 hover:border-primary/50 transition-colors duration-300">
                <div className='flex flex-row gap-3 items-center mb-3'>
                    <Wallet className='items-center text-primary ' />
                    <h1 className="font-bold text-lg text-foreground tracking-wider">Income Summary</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ReportCard
                        title="Total Income"
                        value={stats.totalIncome.toLocaleString()}
                        accent=""
                        sub='Lifetime/ Filtered'
                    />
                    <ReportCard
                        title="Yearly Income"
                        value={stats.yearlyIncome.toLocaleString()}
                        sub={currentYear}
                        accent=""
                    />
                    <ReportCard
                        title="Monthly Income"
                        value={stats.monthlyIncome.toLocaleString()}
                        sub={currentMonth + ", " + currentYear}
                        accent=""
                    />
                    <ReportCard
                        title="Daily Income"
                        value={stats.dailyIncome.toLocaleString()}
                        sub={currentDay}
                        accent=""
                    />
                </div>
            </div>

            <AuthorReportComponent
                data={tableData} 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isFetching={isLoading}
                total={tableData.length}
            />
        </div>
    );
}