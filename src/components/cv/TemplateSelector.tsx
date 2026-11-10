"use client";

import {
    CV_TEMPLATES,
    type CvTemplateId,
} from "./templateRegistry";

interface TemplateSelectorProps {
    selectedTemplate: CvTemplateId;
    onSelect: (templateId: CvTemplateId) => void;
}

export default function TemplateSelector({
    selectedTemplate,
    onSelect,
}: TemplateSelectorProps) {
    return (
        <aside className="flex h-full min-h-0 w-64 shrink-0 flex-col border-r border-[#E8EDEF] bg-[#F0F4F7]">
            <div className="border-b border-[#E8EDEF] px-4 py-5">
                <h2 className="text-lg font-semibold text-[#141414]">
                    CV Templates
                </h2>

                <p className="mt-1 text-xs text-[#54595F]">
                    Choose your preferred design
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <div className="flex flex-col gap-3">
                    {CV_TEMPLATES.map((template) => {
                        const isSelected =
                            selectedTemplate === template.id;

                        return (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => onSelect(template.id)}
                                aria-pressed={isSelected}
                                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                    isSelected
                                        ? "border-[#008EED] bg-[#E8F5FF]"
                                        : "border-[#E8EDEF] bg-white hover:border-[#05A7F7]"
                                }`}
                            >
                                <div className="mb-3 flex h-32 items-center justify-center rounded-lg border border-[#E8EDEF] bg-[#F5F7FA]">
                                    <div className="flex h-24 w-16 flex-col gap-1 rounded-sm bg-white p-2 shadow-sm">
                                        <div className="h-2 w-9 rounded-sm bg-[#02394F]" />
                                        <div className="h-1 w-12 rounded-sm bg-[#008EED]" />
                                        <div className="mt-2 h-1 w-10 rounded-sm bg-[#54595F]/40" />
                                        <div className="h-1 w-full rounded-sm bg-[#54595F]/20" />
                                        <div className="h-1 w-11 rounded-sm bg-[#54595F]/20" />
                                        <div className="mt-1 h-1 w-8 rounded-sm bg-[#54595F]/40" />
                                        <div className="h-1 w-full rounded-sm bg-[#54595F]/20" />
                                        <div className="h-1 w-10 rounded-sm bg-[#54595F]/20" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-[#141414]">
                                        {template.name}
                                    </span>

                                    {isSelected && (
                                        <span className="text-xs font-medium text-[#008EED]">
                                            Selected
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-xs text-[#54595F]">
                                    {template.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}