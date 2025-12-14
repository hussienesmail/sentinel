import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  disableMonitorConfig,
  enableMonitorConfig,
  type MonitorConfig,
} from "../../data/monitor-config";
import { Button } from "../ui/button";

type MointorActionsProps = {
  data: MonitorConfig;
  onActionExecuted?: () => void;
};

export function MointorActions({
  data,
  onActionExecuted,
}: MointorActionsProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    try {
      setLoading(true);
      await enableMonitorConfig(data.id);
      toast.success("Monitor enabled successfully!");
      onActionExecuted?.();
    } catch {
      toast.error("Failed to enable monitor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    try {
      setLoading(true);
      await disableMonitorConfig(data.id);
      toast.success("Monitor disabled successfully!");
      onActionExecuted?.();
    } catch {
      toast.error("Failed to disable monitor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="w-full justify-start"
        disabled={loading}
        onClick={() => navigate(`/monitors/${data.id}/edit`)}
      >
        <span>Edit</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="w-full justify-start"
        disabled={loading}
        onClick={data.enabled ? handleDisable : handleEnable}
      >
        <span>{data.enabled ? "Desactivate" : "Activate"}</span>
      </Button>
    </div>
  );
}
