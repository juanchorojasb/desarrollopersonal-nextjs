'use client';

import Link from 'next/link';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  position: number;
  videoUrl: string | null;
}

interface Module {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

export default function ModulesList({ modules, courseId }: { modules: Module[], courseId: string }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpanded(newExpanded);
  };

  if (modules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay módulos creados aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <div key={module.id} className="border border-gray-200 rounded-lg">
          <div className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer" onClick={() => toggleModule(module.id)}>
            <div className="flex items-center gap-3">
              {expanded.has(module.id) ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                <p className="text-sm text-gray-500">{module.lessons.length} lecciones</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/courses/${courseId}/modules/${module.id}/lessons/new`}>
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </Link>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {expanded.has(module.id) && (
            <div className="p-4 space-y-2">
              {module.lessons.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No hay lecciones en este módulo</p>
              ) : (
                module.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{lesson.title}</p>
                      <p className="text-sm text-gray-500">{lesson.duration ? `${lesson.duration} min` : 'Sin duración'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
