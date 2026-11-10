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
        <aside className="w-full min-w-0 shrink-0 border-b border-[#E8EDEF] bg-[#F0F4F7] lg:flex lg:h-full lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
            <div className="hidden border-b border-[#E8EDEF] px-4 py-5 lg:block">
                <h2 className="text-lg font-semibold text-[#141414]">
                    CV Templates
                </h2>

                <p className="mt-1 text-xs text-[#54595F]">
                    Choose your preferred design
                </p>
            </div>

            <div className="min-w-0 overflow-x-auto px-3 pb-3 lg:min-h-0 lg:flex-1 lg:overflow-x-hidden lg:overflow-y-auto lg:p-3">
                <div className="flex w-max gap-3 lg:w-full lg:flex-col">
                    {CV_TEMPLATES.map((template) => {
                        const isSelected =
                            selectedTemplate === template.id;

                        return (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => onSelect(template.id)}
                                aria-pressed={isSelected}
                                className={`w-36 shrink-0 rounded-xl border p-2.5 text-left transition-colors sm:w-44 lg:w-full lg:p-3 ${
                                    isSelected
                                        ? "border-[#008EED] bg-[#E8F5FF]"
                                        : "border-[#E8EDEF] bg-white hover:border-[#05A7F7]"
                                }`}
                            >
                                <div className="mb-2 flex h-24 items-center justify-center rounded-lg border border-[#E8EDEF] bg-[#F5F7FA] lg:mb-3 lg:h-32">
                                    <div className="flex h-20 w-14 flex-col gap-1 rounded-sm bg-white p-2 shadow-sm lg:h-24 lg:w-16">
                                        <div className="h-2 w-9 rounded-sm bg-[#02394F]" />
                                        <div className="h-1 w-full rounded-sm bg-[#008EED]" />
                                        <div className="mt-2 h-1 w-10 rounded-sm bg-[#54595F]/40" />
                                        <div className="h-1 w-full rounded-sm bg-[#54595F]/20" />
                                        <div className="h-1 w-11 rounded-sm bg-[#54595F]/20" />
                                        <div className="mt-1 h-1 w-8 rounded-sm bg-[#54595F]/40" />
                                        <div className="h-1 w-full rounded-sm bg-[#54595F]/20" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-sm font-semibold text-[#141414]">
                                        {template.name}
                                    </span>

                                    {isSelected && (
                                        <span className="text-[10px] font-medium text-[#008EED]">
                                            Selected
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 line-clamp-2 text-xs text-[#54595F]">
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