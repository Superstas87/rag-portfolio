import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
        
        <div className="grid gap-14 md:grid-cols-2 items-center">
          
          {/* Left */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Давайте работать вместе
            </h2>

            <p className="text-zinc-300 max-w-md leading-relaxed">
              У Вас есть на примете проект, вы хотите сотрудничать или просто пообщаться?
              Я всегда открыт для обсуждения новых идей.
            </p>

            {/* Connect Button */}
            <a
              href="mailto:dargo87@ya.ru"
              className="
                inline-flex items-center gap-3
                rounded-xl px-6 py-3 font-medium
                bg-zinc-900 text-white
                border border-zinc-700
                hover:border-white hover:bg-zinc-800
                transition-all duration-300
              "
            >
              <Mail size={18} />
              Написать
            </a>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start md:items-end gap-6">
            <span className="text-sm uppercase tracking-widest text-zinc-400">
              Где меня найти
            </span>

            <div className="flex flex-wrap gap-4">

              {/* Telegram */}
              <a
                href="https://t.me/Superstas87"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="group flex h-14 w-14 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-900 hover:border-white transition"
              >
                <img
                  src="/telegram.png"
                  alt="Telegram"
                  className="h-6 w-6 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all"
                />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Superstas87"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group flex h-14 w-14 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-900 hover:border-white transition"
              >
                <img
                  src="/github.png"
                  alt="GitHub"
                  className="h-6 w-6 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all"
                />
              </a>

              {/* HH.ru */}
              <a
                href="https://hh.ru/resume/910d81caff1139257b0039ed1f6979466c335a?hhtmFrom=profile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HH.ru"
                className="group flex h-14 w-14 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-900 hover:border-white transition"
              >
                <img
                  src="/hh.png"
                  alt="HH.ru"
                  className="h-6 w-6 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all"
                />
              </a>

              {/* Сетка */}
              <a
                href="https://setka.ru/users/019d0972-9534-7511-87be-52505a6e3a22"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Сетка"
                className="group flex h-14 w-14 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-900 hover:border-white transition"
              >
                <img
                  src="/setka.png"
                  alt="Сетка"
                  className="h-6 w-6 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all"
                />
              </a>              
              
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/stanislav-rybakov-8a5a45447"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group flex h-14 w-14 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-900 hover:border-white transition"
              >
                <img
                  src="/linkedin.png"
                  alt="LinkedIn"
                  className="h-6 w-6 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all"
                />
              </a>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row sm:justify-between gap-4 text-sm text-zinc-400">
          <span>© 2026 Станислав Рыбаков</span>
          <span className="text-zinc-500">
            Designed & Built by Rybakov
          </span>
        </div>
      </div>
    </footer>
  );
}