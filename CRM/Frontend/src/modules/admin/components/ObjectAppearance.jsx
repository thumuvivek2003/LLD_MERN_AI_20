import {
  OBJECT_COLOR_CHOICES,
  OBJECT_ICON_CHOICES,
  objectColorClass,
  resolveIcon,
} from '../../../core/utils/icons.js';
import cx from '../../../core/utils/cx.js';

/** Icon swatch row + colour swatches shared by Create Object and Edit Object → Details. */
export function ObjectAppearance({ icon, color, onIconChange, onColorChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mf-label">Object Icon</label>
        <div className="flex flex-wrap gap-2">
          {OBJECT_ICON_CHOICES.map((name) => {
            const Icon = resolveIcon(name);
            const active = name === icon;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onIconChange(name)}
                aria-label={name}
                className={cx(
                  'flex h-10 w-10 items-center justify-center rounded-lg ring-1 transition',
                  active
                    ? cx(objectColorClass(color), 'ring-2 ring-accent')
                    : 'bg-slate-50 text-slate-400 ring-slate-200 hover:bg-slate-100 hover:text-slate-600',
                )}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mf-label">Accent Colour</label>
        <div className="flex flex-wrap gap-2">
          {OBJECT_COLOR_CHOICES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onColorChange(name)}
              aria-label={name}
              className={cx(
                'h-8 w-8 rounded-lg ring-1 transition',
                objectColorClass(name),
                name === color ? 'ring-2 ring-slate-900' : 'hover:scale-105',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ObjectAppearance;
