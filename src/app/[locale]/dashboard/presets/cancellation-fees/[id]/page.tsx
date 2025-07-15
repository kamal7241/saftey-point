"use client";
import { fetchCancellationFeeById } from "@/api/cancellationFeesService";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import PageHeader from "@/components/global/PageHeader";
import Button from "@/components/ui/Button";
import ArrowLeft from "@/components/ui/icons/ArrowLeft";
import { useRouter } from "@/i18n/routing";
import { CancellationFee } from "@/types/ui.types";
import Loader from "@/components/ui/Loader";

export default function CancellationFeeViewPage({ params }: { params: { id: string } }) {
  const t = useTranslations("common");
  const router = useRouter();
  const [cancellationFee, setCancellationFee] = useState<CancellationFee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchCancellationFeeById(params.id);
        if (result.success && result.data) {
          setCancellationFee(result.data);
        } else {
          setError(result.message || "Failed to fetch cancellation fee");
        }
      } catch {
        setError("An error occurred while fetching the cancellation fee");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("presets"), href: "/dashboard/presets" },
    { label: t("cancellation_fees"), href: "/dashboard/presets/cancellations-refunds" },
    { label: cancellationFee?.name || "Cancellation Fee", href: "#" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error || !cancellationFee) {
    return (
      <div>
        <PageHeader 
          breadcrumbItems={breadcrumbItems} 
          title="Cancellation Fee Details"
          actions={
            <Button
              label={t("buttons.back")}
              onClick={() => router.back()}
              icon={<ArrowLeft />}
              variant="transparent"
            />
          }
        />
        <div className="mt-6 bg-white rounded-2xl p-6">
          <div className="text-center text-red-600">
            {error || "Cancellation fee not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        breadcrumbItems={breadcrumbItems} 
        title={cancellationFee.name}
        actions={
          <Button
            label={t("buttons.back")}
            onClick={() => router.back()}
            icon={<ArrowLeft />}
            variant="transparent"
          />
        }
      />

      <div className="mt-6 bg-white rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{cancellationFee.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900">{cancellationFee.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-gray-900 capitalize">{cancellationFee.type.replace('_', ' ').toLowerCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className={`font-medium ${cancellationFee.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {cancellationFee.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Fee Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Hours Before Start</label>
                <p className="text-gray-900">{cancellationFee.hoursBeforeStart} hours</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Sort Order</label>
                <p className="text-gray-900">{cancellationFee.sortOrder}</p>
              </div>
              {cancellationFee.type === 'PERCENTAGE' && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Percentage</label>
                  <p className="text-gray-900">{cancellationFee.percentage}%</p>
                </div>
              )}
              {cancellationFee.type === 'FIXED_AMOUNT' && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Fixed Amount</label>
                  <p className="text-gray-900">{cancellationFee.fixedAmount}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Created At</label>
                <p className="text-gray-900">{new Date(cancellationFee.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Updated At</label>
                <p className="text-gray-900">{new Date(cancellationFee.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 