
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AgentDetailView } from "@/components/agent-detail/AgentDetailView";

const AgentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!id) {
      navigate("/developer/agents");
    }
  }, [id, navigate]);
  
  return <AgentDetailView />;
};

export default AgentDetailPage;
