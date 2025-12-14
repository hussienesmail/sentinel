import { MyTable } from "@/components/sentinel/MyTable";
import { Button } from "@/components/ui/button";
import {
  listIntegrationConfigs,
  type IntegrationConfig,
} from "@/data/integration-config";
import { useSensitiveInfo } from "@/hooks/useSensitiveInfo";
import { formatTimestamp } from "@/lib/date";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function IntegrationsPage() {
  const navigate = useNavigate();

  const { showSensitiveInfo } = useSensitiveInfo();

  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);

  const fetchIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listIntegrationConfigs();
      setIntegrations(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col mb-4">
          <h1 className="text-2xl font-semibold">Integrations</h1>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">
              Manage your integrations with third-party services to allow alerts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => navigate("/integrations/new")}>
            <PlusIcon className="w-4 h-4" />
            <span>Create Integration</span>
          </Button>
        </div>
      </div>

      <MyTable
        data={integrations}
        loading={loading}
        columns={["Name", "Webhook Url", "Created At"]}
        renderRow={(integration: IntegrationConfig) => {
          return (
            <tr key={integration.id}>
              <td>
                <div className="flex items-center gap-1">
                  {integration.type === "DISCORD" && (
                    <img
                      src="/assets/discord.png"
                      alt="Discord"
                      className="w-5 h-5"
                    />
                  )}

                  {integration.type === "SLACK" && (
                    <img
                      src="/assets/slack.png"
                      alt="Slack"
                      className="w-5 h-5"
                    />
                  )}

                  <span>{integration.name}</span>
                </div>
              </td>
              <td className="break-line-table">
                {showSensitiveInfo
                  ? integration.url
                  : "••••••••••••••••••••••••"}
              </td>
              <td>{formatTimestamp(integration.created_at, true)}</td>
            </tr>
          );
        }}
      />
    </>
  );
}
