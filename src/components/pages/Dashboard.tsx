import { useTranslations } from "next-intl";
import PageHeader from "../global/PageHeader";
import BarChartComponent from "../ui/BarChartComponent";
import StatsCard from "../ui/StatsCard";
import CourtHouse from "../ui/icons/CourtHouse";
import ClipboardTick from "../ui/icons/ClipboardTick";
import TimerEmpty from "../ui/icons/TimerEmpty";
import ClipboardClose from "../ui/icons/ClipboardClose";
import LineChartComponent from "../ui/LineChartComponent";
import PieChartComponent from "../ui/PieChartComponent";
// import Chart from "../components/Chart";
// import StatsCard from "../components/StatsCard";

export default function Dashboard() {

    const t = useTranslations("common");
    const breadcrumbItems = [
        { label: t("home"), href: "/" },
        { label: t("dashboard"), href: "/dashboard" },
    ];
    const studentsData = [
        { month: 'Jan', value: 55 },
        { month: 'Feb', value: 65 },
        { month: 'Mar', value: 89 },
        { month: 'Apr', value: 30 },
        { month: 'May', value: 31 },
        { month: 'Jun', value: 30 },
        { month: 'Jul', value: 80 },
        { month: 'Aug', value: 20 },
        { month: 'Sep', value: 72 },
        { month: 'Oct', value: 14 },
        { month: 'Nov', value: 15 },
        { month: 'Dec', value: 100 },
    ];
    const netSalesData = [
        { month: 'Jan', value: 100 },
        { month: 'Feb', value: 0 },
        { month: 'Mar', value: 9 },
        { month: 'Apr', value: 70 },
        { month: 'May', value: 91 },
        { month: 'Jun', value: 30 },
        { month: 'Jul', value: 80 },
        { month: 'Aug', value: 20.5 },
        { month: 'Sep', value: 72 },
        { month: 'Oct', value: 114.3 },
        { month: 'Nov', value: 15 },
        { month: 'Dec', value: 10 },
    ];

    return (
        <div>
            <PageHeader
                breadcrumbItems={breadcrumbItems}
                title={t("dashboard")}
            />


            {/* Stats Cards */}
            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                <StatsCard
                    icon={<CourtHouse />}
                    color="brand"
                    number={100}
                    name={t("total_companies")}
                />
                <StatsCard
                    icon={<ClipboardTick />}
                    color="success"
                    number={9}
                    name={t("approved_companies")}
                />
                <StatsCard
                    icon={<TimerEmpty />}
                    color="warning"
                    number={90}
                    name={t("suspended_companies")}
                />
                <StatsCard
                    icon={<ClipboardClose />}
                    color="red"
                    number={10}
                    name={t("inactive_companies")}
                />
            </div>
            <div className="dashboard-content">
                <div className="grid gap-6 grid-cols-4 grid-rows-4">
                    <div className="col-span-3 row-span-4">
                        <BarChartComponent title="Students number change per month" />
                    </div>
                    <div className="row-span-2 col-start-4">
                        <LineChartComponent title="Students" value="86%" data={studentsData} />
                    </div>
                    <div className="row-span-2 col-start-4 row-start-3">
                        <LineChartComponent title="Net sales" value="+34%" data={netSalesData} />
                    </div>
                    <PieChartComponent />
                </div>
            </div>
        </div>
    );
}
