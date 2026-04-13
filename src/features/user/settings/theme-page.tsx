import SidebarWrapper from "../sidebar/sidebar-wrapper";
import ThemeSelectionPage from "./theme-selection-page";

export default function ThemeSettingsPage() {
    return (
        <div>
            <SidebarWrapper>
                <ThemeSelectionPage />
            </SidebarWrapper>
        </div>
    );
}
