import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
    const { i18n } = useTranslation()

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }

    // Check if the current language is English
    const isEn = i18n.language === "en"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    {/* English Flag Icon */}
                    <div className={`transition-all duration-300 items-center justify-center ${isEn ? "scale-100 rotate-0" : "scale-0 -rotate-90 opacity-0"
                        }`}>
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                            <rect width={20} height={20} />
                            <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#F0F0F0" />
                            <path d="M9.56445 9.99995H19.9992C19.9992 9.09737 19.8789 8.22299 19.6547 7.39124H9.56445V9.99995Z" fill="#D80027" />
                            <path d="M9.56445 4.78266H18.5315C17.9193 3.78375 17.1366 2.90083 16.2241 2.17395H9.56445V4.78266Z" fill="#D80027" />
                            <path d="M10.0002 20C12.3537 20 14.5169 19.1865 16.2251 17.826H3.77539C5.48359 19.1865 7.64676 20 10.0002 20Z" fill="#D80027" />
                            <path d="M1.46699 15.2174H18.5315C19.023 14.4154 19.4041 13.5389 19.6548 12.6086H0.34375C0.594414 13.5389 0.975547 14.4154 1.46699 15.2174Z" fill="#D80027" />
                            <path d="M4.63219 1.56164H5.54348L4.69582 2.17746L5.01961 3.17391L4.17199 2.55809L3.32437 3.17391L3.60406 2.31309C2.85773 2.93477 2.20359 3.66313 1.66453 4.47469H1.95652L1.41695 4.86668C1.33289 5.00691 1.25227 5.14937 1.175 5.29395L1.43266 6.08695L0.951953 5.7377C0.832461 5.99086 0.723164 6.24973 0.624922 6.51398L0.908789 7.38773H1.95652L1.10887 8.00356L1.43266 9L0.585039 8.38418L0.0773047 8.75309C0.0264844 9.1616 0 9.57769 0 10H10C10 4.47719 10 3.82609 10 0C8.02453 0 6.18301 0.573047 4.63219 1.56164ZM5.01961 9L4.17199 8.38418L3.32437 9L3.64816 8.00356L2.80051 7.38773H3.84824L4.17199 6.39129L4.49574 7.38773H5.54348L4.69582 8.00356L5.01961 9ZM4.69582 5.09051L5.01961 6.08695L4.17199 5.47113L3.32437 6.08695L3.64816 5.09051L2.80051 4.47469H3.84824L4.17199 3.47824L4.49574 4.47469H5.54348L4.69582 5.09051ZM8.60656 9L7.75895 8.38418L6.91133 9L7.23512 8.00356L6.38746 7.38773H7.4352L7.75895 6.39129L8.0827 7.38773H9.13043L8.28277 8.00356L8.60656 9ZM8.28277 5.09051L8.60656 6.08695L7.75895 5.47113L6.91133 6.08695L7.23512 5.09051L6.38746 4.47469H7.4352L7.75895 3.47824L8.0827 4.47469H9.13043L8.28277 5.09051ZM8.28277 2.17746L8.60656 3.17391L7.75895 2.55809L6.91133 3.17391L7.23512 2.17746L6.38746 1.56164H7.4352L7.75895 0.565195L8.0827 1.56164H9.13043L8.28277 2.17746Z" fill="#0052B4" />
                        </svg>
                    </div>

                    {/* Myanmar Flag Icon */}
                    <div className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${!isEn ? "scale-100 rotate-0" : "scale-0 rotate-90 opacity-0"
                        }`}>
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                            <rect width={20} height={20} />
                            <rect width={1876} height={988} transform="translate(-284 -588)" />
                            <path
                                d="M19.378 13.4783C19.78 12.395 20 11.2232 20 10C20 8.77683 19.78 7.60507 19.378 6.52179L10 5.65222L0.621992 6.52179C0.220039 7.60507 0 8.77683 0 10C0 11.2232 0.220039 12.395 0.621992 13.4783L10 14.3478L19.378 13.4783Z"
                                fill="#6DA544"
                            />
                            <path
                                d="M19.3771 6.52176C17.9642 2.71375 14.2987 0 9.9991 0C5.69945 0 2.03402 2.71375 0.621094 6.52176H19.3771Z"
                                fill="#FFDA44"
                            />
                            <path
                                d="M9.9991 20C14.2987 20 17.9642 17.2863 19.3771 13.4783H0.621094C2.03402 17.2863 5.69945 20 9.9991 20Z"
                                fill="#D80027"
                            />
                            <path
                                d="M16.8573 8.46042H11.6188L9.99996 3.47827L8.38113 8.46042H3.14258L7.38066 11.5396L5.76184 16.5218L9.99996 13.4783L14.2381 16.5217L12.6193 11.5395L16.8573 8.46042Z"
                                fill="#F0F0F0"
                            />
                        </svg>

                    </div>

                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("mm")}>
                    Myanmar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}