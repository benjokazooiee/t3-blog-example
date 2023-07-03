import DashHero from "../dashboard/DashHero";
import DashNav from "../dashboard/DashNav";

type LayoutProps = {
    children: React.ReactNode,
  };
const DashboardLayout = ({children}: LayoutProps) => {
    return (
        <>
        <DashHero />
        <DashNav />
        {children}
        </>
    )
}

export default DashboardLayout