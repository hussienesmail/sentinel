import { MyTable } from "@/components/sentinel/MyTable";
import { Button } from "@/components/ui/button";
import { listApiKeys, type ApiKeyConfig } from "@/data/api-key-config";
import { useSensitiveInfo } from "@/hooks/useSensitiveInfo";
import { formatTimestamp } from "@/lib/date";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function TokensPage() {
  const navigate = useNavigate();

  const { showSensitiveInfo } = useSensitiveInfo();

  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);

  const fetchApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listApiKeys();
      setApiKeys(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col mb-4">
          <h1 className="text-2xl font-semibold">Tokens</h1>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">
              Manage your API tokens used to authenticate requests.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => navigate("/tokens/new")}>
            <PlusIcon className="w-4 h-4" />
            <span>Create Token</span>
          </Button>
        </div>
      </div>

      <MyTable
        data={apiKeys}
        loading={loading}
        columns={["Name", "Key", "Created At"]}
        renderRow={(apiKey: ApiKeyConfig) => {
          return (
            <tr key={apiKey.id}>
              <td>{apiKey.name}</td>
              <td className="break-line-table">
                {showSensitiveInfo ? apiKey.value : "••••••••••••••••••••••••"}
              </td>
              <td>{formatTimestamp(apiKey.created_at, true)}</td>
            </tr>
          );
        }}
      />
    </>
  );
}
