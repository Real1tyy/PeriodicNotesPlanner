import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "Periodix-Planner"
    },
    "installation",
    "quickstart",
    {
      type: "category",
      label: "Features",
      collapsible: true,
      items: [
        "features/overview",
        "features/time-budgeting",
        "features/allocation-editor",
        "features/note-generation",
        "features/note-interconnection",
        "features/navigation"
      ]
    },
    "configuration",
    "faq",
    "troubleshooting",
    "contributing",
    "support"
  ]
};

export default sidebars;
