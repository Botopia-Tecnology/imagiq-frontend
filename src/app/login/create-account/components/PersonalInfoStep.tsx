import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PersonalInfoData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  codigo_pais: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  contrasena: string;
  confirmPassword: string;
}

interface PersonalInfoStepProps {
  formData: PersonalInfoData;
  onChange: (data: Partial<PersonalInfoData>) => void;
  disabled?: boolean;
}

export function PersonalInfoStep({ formData, onChange, disabled }: PersonalInfoStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validar requisitos de seguridad de la contraseña
  const passwordRequirements = {
    minLength: formData.contrasena.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.contrasena),
    hasLowerCase: /[a-z]/.test(formData.contrasena),
    hasNumber: /[0-9]/.test(formData.contrasena),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.contrasena),
  };

  // Parse fecha_nacimiento (YYYY-MM-DD) into day, month, year
  const parsedDate = formData.fecha_nacimiento ? formData.fecha_nacimiento.split('-') : ['', '', ''];
  const [year, month, day] = parsedDate;

  // Country codes
  const countryCodes = [
    { code: '+57', country: 'CO', label: 'Colombia (+57)' },
    { code: '+1', country: 'US', label: 'Estados Unidos (+1)' },
    { code: '+52', country: 'MX', label: 'México (+52)' },
    { code: '+54', country: 'AR', label: 'Argentina (+54)' },
    { code: '+56', country: 'CL', label: 'Chile (+56)' },
    { code: '+51', country: 'PE', label: 'Perú (+51)' },
    { code: '+58', country: 'VE', label: 'Venezuela (+58)' },
    { code: '+593', country: 'EC', label: 'Ecuador (+593)' },
    { code: '+55', country: 'BR', label: 'Brasil (+55)' },
    { code: '+34', country: 'ES', label: 'España (+34)' },
  ];

  // Generate date options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const handleDateChange = (newDay: string, newMonth: string, newYear: string) => {
    // Always update, even with partial selections - this allows dropdowns to work independently
    onChange({ fecha_nacimiento: `${newYear}-${newMonth}-${newDay}` });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Juan"
            value={formData.nombre}
            onChange={(e) => onChange({ nombre: e.target.value })}
            disabled={disabled}
            autoComplete="given-name"
            autoCapitalize="words"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            type="text"
            placeholder="Pérez"
            value={formData.apellido}
            onChange={(e) => onChange({ apellido: e.target.value })}
            disabled={disabled}
            autoComplete="family-name"
            autoCapitalize="words"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico *</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          disabled={disabled}
          autoComplete="email"
          autoCapitalize="none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <div className="flex gap-2">
            <select
              value={`+${formData.codigo_pais}`}
              onChange={(e) => onChange({ codigo_pais: e.target.value.replace('+', '') })}
              disabled={disabled}
              style={{ backgroundColor: '#ffffff' }}
              className="w-[110px] h-9 rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              {countryCodes.map((cc) => (
                <option key={cc.code} value={cc.code}>
                  {cc.country} {cc.code}
                </option>
              ))}
            </select>
            <Input
              id="telefono"
              type="tel"
              inputMode="tel"
              placeholder="3001234567"
              value={formData.telefono}
              onChange={(e) => onChange({ telefono: e.target.value })}
              disabled={disabled}
              autoComplete="tel"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Fecha de nacimiento *</Label>
          <div className="flex gap-2">
            <select
              value={day}
              onChange={(e) => handleDateChange(e.target.value, month, year)}
              disabled={disabled}
              style={{ backgroundColor: '#ffffff' }}
              className="h-9 w-[70px] rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="">Día</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {parseInt(d)}
                </option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => handleDateChange(day, e.target.value, year)}
              disabled={disabled}
              style={{ backgroundColor: '#ffffff' }}
              className="h-9 flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="">Mes</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => handleDateChange(day, month, e.target.value)}
              disabled={disabled}
              style={{ backgroundColor: '#ffffff' }}
              className="h-9 w-[90px] rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="">Año</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo_documento">Tipo de documento *</Label>
          <select
            id="tipo_documento"
            value={formData.tipo_documento}
            onChange={(e) => onChange({ tipo_documento: e.target.value })}
            disabled={disabled}
            style={{ backgroundColor: '#ffffff' }}
            className="w-full h-9 rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="CC">CC</option>
            <option value="CE">CE</option>
            <option value="TI">TI</option>
            <option value="PA">Pasaporte</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="numero_documento">Número *</Label>
          <Input
            id="numero_documento"
            type="text"
            inputMode="numeric"
            placeholder="1234567890"
            value={formData.numero_documento}
            onChange={(e) => onChange({ numero_documento: e.target.value })}
            disabled={disabled}
            autoComplete="off"
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contrasena">Contraseña *</Label>
          <div className="relative">
            <Input
              id="contrasena"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.contrasena}
              onChange={(e) => onChange({ contrasena: e.target.value })}
              disabled={disabled}
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={disabled}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Indicadores de requisitos de contraseña */}
          {formData.contrasena && (
            <div className="space-y-1 text-xs mt-2">
              <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="font-bold">{passwordRequirements.minLength ? '✓' : '○'}</span>
                <span>Mínimo 8 caracteres</span>
              </div>
              <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="font-bold">{passwordRequirements.hasUpperCase ? '✓' : '○'}</span>
                <span>Una letra mayúscula</span>
              </div>
              <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="font-bold">{passwordRequirements.hasLowerCase ? '✓' : '○'}</span>
                <span>Una letra minúscula</span>
              </div>
              <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="font-bold">{passwordRequirements.hasNumber ? '✓' : '○'}</span>
                <span>Un número</span>
              </div>
              <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="font-bold">{passwordRequirements.hasSpecialChar ? '✓' : '○'}</span>
                <span>Un carácter especial (!@#$%...)</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              disabled={disabled}
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={disabled}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Indicador de coincidencia de contraseñas */}
          {formData.confirmPassword && (
            <div className="text-xs mt-2">
              {formData.contrasena === formData.confirmPassword ? (
                <div className="flex items-center gap-1 text-green-600 transition-colors">
                  <span className="font-bold">✓</span>
                  <span>Las contraseñas coinciden</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600 transition-colors">
                  <span className="font-bold">✗</span>
                  <span>Las contraseñas no coinciden</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
