
export default function Features() {
    const featuresList = [
        {title:"Simple",descripition:"Easy to use interface for quick CSV viewing and conversion."},
        {title:"Fast",descripition:"Optimized for speed to handle large CSV files efficiently for viewing."},
        {title:"Own your CSV",descripition:"Your data privacy is our top priority."},
    ]
  return (
    <section className="p-5">
      <div className="mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {featuresList.map((feature, index) => (
            <div key={index} className="flex flex-col items-start space-y-2">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.descripition}</p>
            </div>
          ))}
          {/* Vertical dividers positioned absolutely relative to grid */}
          <div className="hidden md:block absolute top-0 bottom-0 left-[33.33%] w-px border-r border-dashed border-neutral-300 dark:border-neutral-800 -my-5 h-[calc(100%+2.5rem)]"/>
          <div className="hidden md:block absolute top-0 bottom-0 left-[66.66%] w-px border-r border-dashed border-neutral-300 dark:border-neutral-800 -my-5 h-[calc(100%+2.5rem)]"/>
        </div>
      </div>
    </section>
  )
}
