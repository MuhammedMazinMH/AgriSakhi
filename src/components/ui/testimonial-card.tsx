import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "flex flex-col rounded-lg border-2 border-green-300 dark:border-green-600",
        "bg-gradient-to-b from-white to-green-50 dark:from-gray-800 dark:to-gray-700",
        "p-4 text-start sm:p-6",
        "hover:from-green-50 hover:to-green-100 dark:hover:from-gray-700 dark:hover:to-gray-600",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-all duration-300 shadow-md hover:shadow-xl",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-green-200 dark:ring-green-700">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-gray-900 dark:text-white">
            {author.name}
          </h3>
          <p className="text-sm text-green-600 dark:text-green-400">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
        {text}
      </p>
    </Card>
  )
}
