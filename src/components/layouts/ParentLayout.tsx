import SiteNav from "../site/SiteNav";
import SiteFooter from "../site/SiteFooter";
type LayoutProps = {
    children: React.ReactNode,
  };
const ParentLayout = ({children}: LayoutProps) => {
    return (
        <main>
            <SiteNav />
            {children}
            <SiteFooter />
        </main>
    )
}

export default ParentLayout