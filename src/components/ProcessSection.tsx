import { Card } from "@/components/ui/card";

interface ProcessSectionProps {
  language: "pt" | "en";
}

const content = {
  pt: {
    title: "Como trabalhamos",
    steps: [
      {
        number: "01",
        title: "Diagnóstico",
        description: "entendemos metas, dados, ferramentas e restrições.",
      },
      {
        number: "02",
        title: "Blueprint & MVP",
        description:
          "definimos casos de uso, arquitetura e entregamos um MVP funcional.",
      },
      {
        number: "03",
        title: "Escala & BI",
        description:
          "colocamos agentes e BI para rodar com métricas, rotinas e melhorias contínuas.",
      },
    ],
  },
  en: {
    title: "How we work",
    steps: [
      {
        number: "01",
        title: "Fast Diagnosis",
        description: "we understand goals, data, tools and constraints.",
      },
      {
        number: "02",
        title: "Blueprint & MVP",
        description:
          "we define use cases, architecture and deliver a functional MVP.",
      },
      {
        number: "03",
        title: "Scale & BI",
        description:
          "we deploy agents and BI with metrics, routines and continuous improvements.",
      },
    ],
  },
};

export const ProcessSection = ({ language }: ProcessSectionProps) => {
  const t = content[language];

  return (
    <section id="como-trabalhamos" className="py-20 relative scroll-mt-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 animate-fade-in">
          {t.title}
        </h2>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {t.steps.map((step, index) => (
            <Card
              key={index}
              className="p-8 bg-card border-border relative overflow-hidden group hover:border-primary transition-colors duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                {step.number}
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
