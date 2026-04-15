import { useState } from "react";
import ChatFullView from "../chat-fullview";
import FriendLayout from "./friend-layout";
import FriendAddFriendPage from "./friend-addfriend-page";
import FriendDiscoveryFriendPage from "./friend-discoveryfriend-page";
import FriendListFriendPage from "./friend-listfriend-page";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import owlLogo from "@/assets/owl-logo/black/owl-512.png";
export default function FriendPage() {
    const [activeTab, setActiveTab] = useState("list");

    const renderContent = () => {
        switch (activeTab) {
            case "add":
                return <FriendAddFriendPage />;
            case "list":
                return <FriendListFriendPage />;
            case "discovery":
                return <FriendDiscoveryFriendPage />;
            default:
                return <FriendListFriendPage />;
        }
    };
    return (
        <div>
            <FriendLayout>
                {/* <ChatFallback/> */}
                <ChatFullView>
                    <div className="flex flex-col lg:flex-row items-center justify-between w-full mt-4 lg:mt-6 lg:px-10">
                        <div className="flex items-center gap-4 mb-6 lg:mb-0 ">
                            <div style={{ filter: `var(--logo-filter, invert(0.8) sepia(0.5) saturate(1.5))` }}>
                                <img
                                    src={owlLogo}
                                    alt="Owl Logo"
                                    className="w-10 h-10"
                                    
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                                    Owl Hub
                                </h1>
                                <p className="text-sm lg:text-base">
                                    Connect with the community of wisdom seekers
                                </p>
                            </div>
                        </div>

                        <Tabs
                            value={activeTab}
                            onValueChange={(value) => setActiveTab(value)}
                            className=""
                        >
                            <TabsList>
                                <TabsTrigger value="list">Friends</TabsTrigger>
                                <TabsTrigger value="add">Requests</TabsTrigger>
                                <TabsTrigger value="discovery">
                                    Discover
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="w-full h-full overflow-y-auto lg:px-10">{renderContent()}</div>
                </ChatFullView>
            </FriendLayout>
        </div>
    );
}
