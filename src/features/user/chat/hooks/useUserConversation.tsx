import { useParams } from "react-router-dom";
import { useMemo } from "react";

export const useUserConversation = () => {
    const params = useParams(); 
    const conversationId = useMemo(
        () => params?.conversationId || "",
        [params?.conversationId]
    );

    const isActive = useMemo(
        () => !!conversationId,
        [conversationId]
    );

    return {
        isActive,
        conversationId,
    };
};