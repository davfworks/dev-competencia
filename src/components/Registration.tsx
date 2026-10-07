import React, { useState, useRef, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { RegistrationData } from '../types';
import registrationData from '../data/registration.json';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, User, Users, Upload, ArrowLeft, FileText, Landmark } from 'lucide-react';

const cfg = registrationData as RegistrationData;

const dateRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const phoneRegex = /^\d{10}$/;

const memberSchema = z.object({
  fullName: z.string().min(3, 'Nombre requerido'),
  birthDate: z.string().regex(dateRegex, 'Formato DD/MM/AAAA'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(phoneRegex, 'Debe tener 10 dígitos'),
  gender: z.string().min(1, 'Género requerido'),
  jerseySize: z.string().min(1, 'Talla requerida'),
});

const individualSchema = z.object({
  fullName: z.string().min(3, 'Nombre requerido'),
  birthDate: z.string().regex(dateRegex, 'Formato DD/MM/AAAA'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(phoneRegex, 'Debe tener 10 dígitos'),
  city: z.string().min(2, 'Ciudad requerida'),
  gender: z.string().min(1, 'Seleccione un género'),
  jerseySize: z.string().min(1, 'Seleccione una talla'),
  observations: z.string().optional(),
  terms: z.boolean().refine(v => v === true, { message: 'Debe aceptar los términos' }),
});

const teamSchema = z.object({
  teamName: z.string().min(3, 'Nombre del equipo requerido'),
  representativeName: z.string().min(3, 'Nombre del representante requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(7, 'Teléfono requerido'),
  members: z.array(memberSchema)
    .min(cfg.minMembers, `Mínimo ${cfg.minMembers} integrantes`)
    .max(cfg.maxMembers, `Máximo ${cfg.maxMembers} integrantes`),
  terms: z.boolean().refine(v => v === true, { message: 'Debe aceptar los términos' }),
});

type IndividualFormData = z.infer<typeof individualSchema>;
type TeamFormData = z.infer<typeof teamSchema>;
type Step = 'form' | 'payment' | 'success';

const input = 'w-full p-4 border-2 border-zinc-200 focus:border-brand outline-none transition-colors';
const label = 'block text-xs uppercase font-bold tracking-widest text-zinc-500 mb-1';
const err = 'text-red-500 text-xs font-bold uppercase mt-1';

function generateCode(): string {
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const D = '0123456789';
  let c = '';
  for (let i = 0; i < 4; i++) c += L[Math.floor(Math.random() * 26)];
  for (let i = 0; i < 6; i++) c += D[Math.floor(Math.random() * 10)];
  return c;
}

async function postRegistration(payload: object) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('server_error');
}

// ── Step indicator ────────────────────────────────────────────────────────────
const STEP_LABELS = ['Datos', 'Pago', 'Confirmación'];

function StepIndicator({ step }: { step: Step }) {
  const activeIndex = step === 'form' ? 0 : step === 'payment' ? 1 : 2;
  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-4 mb-8 md:mb-10">
      {STEP_LABELS.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-black text-sm md:text-base border-2 transition-colors ${
                i < activeIndex
                  ? 'bg-brand border-brand text-white'
                  : i === activeIndex
                  ? 'bg-accent border-accent text-white'
                  : 'bg-white border-zinc-300 text-zinc-400'
              }`}
            >
              {i < activeIndex ? '✓' : i + 1}
            </div>
            <span className={`text-[9px] md:text-xs uppercase tracking-widest font-bold whitespace-nowrap ${i === activeIndex ? 'text-black' : 'text-zinc-400'}`}>
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`w-6 md:w-16 h-0.5 mb-5 transition-colors ${i < activeIndex ? 'bg-brand' : 'bg-zinc-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Success banner ────────────────────────────────────────────────────────────
function SuccessBanner({ code }: { code: string }) {
  return (
    <div className="text-center py-16 bg-zinc-50 p-8">
      <StepIndicator step="success" />
      <div className="text-5xl mb-4 text-brand">✓</div>
      <h3 className="text-2xl font-black uppercase italic text-accent mb-2">¡Inscripción confirmada!</h3>
      <p className="text-zinc-600 mb-8">Revisa tu correo electrónico para los detalles.</p>
      <div className="inline-block bg-black text-white px-8 py-5">
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Código de confirmación</p>
        <p className="text-3xl font-black tracking-[0.2em] font-mono">{code}</p>
      </div>
    </div>
  );
}

// ── Bank details ──────────────────────────────────────────────────────────────
function BankDetailsCard({ unitPrice }: { unitPrice: number }) {
  const bankRows: { label: string; value: string; mono?: boolean }[] = [
    { label: 'Banco', value: cfg.bank.name },
    { label: 'Tipo de cuenta', value: cfg.bank.accountType },
    { label: 'N° de cuenta', value: cfg.bank.accountNumber, mono: true },
    { label: 'Titular', value: cfg.bank.accountHolder },
    { label: 'Identificación', value: cfg.bank.identification, mono: true },
    { label: 'Concepto', value: cfg.bank.concept },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 p-5 md:p-6 shadow-xl bg-white" style={{ borderColor: '#96e0bf' }}>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-brand flex-shrink-0">
          <Landmark size={18} />
        </span>
        <h4 className="text-sm md:text-base font-black uppercase tracking-widest text-brand">
          Datos para Transferencia
        </h4>
        <span className="text-zinc-300 font-black">|</span>
        <span className="text-lg md:text-xl font-black text-accent">${unitPrice.toFixed(2)}</span>
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500">(Valor Individual)</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 p-4 rounded-xl border border-brand/20 text-xs sm:text-sm text-zinc-700">
          {bankRows.map(({ label, value, mono }) => (
            <div key={label}>
              <strong className="text-zinc-900">{label}:</strong>{' '}
              {mono ? (
                <span className="font-mono bg-white px-1.5 py-0.5 rounded text-brand font-bold break-all border border-zinc-200">{value}</span>
              ) : (
                value
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

// ── Payment Step ──────────────────────────────────────────────────────────────
function PaymentStep({
  code, total, count, unitPrice, onConfirm, onBack, submitting, serverError,
}: {
  code: string;
  total: number;
  count: number;
  unitPrice: number;
  onConfirm: (dataUrl: string) => void;
  onBack: () => void;
  submitting: boolean;
  serverError: string;
}) {
  const [fileData, setFileData] = useState<{ dataUrl: string; name: string; isImage: boolean } | null>(null);
  const [fileError, setFileError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    if (!isImage && !isPDF) {
      setFileError('Solo se aceptan imágenes (JPG, PNG) o PDF');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileData({ dataUrl: e.target?.result as string, name: file.name, isImage });
      setFileError('');
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!fileData) {
      setFileError('Debes subir el comprobante de pago para continuar');
      return;
    }
    onConfirm(fileData.dataUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-8 bg-zinc-50 p-8 md:p-12 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="relative z-10 flex items-center gap-1 text-zinc-500 hover:text-brand transition-colors flex-shrink-0 font-bold text-sm uppercase tracking-widest cursor-pointer"
          aria-label="Volver al formulario"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        <h3 className="text-xl font-black uppercase italic tracking-widest">Pago y Confirmación</h3>
      </div>

      <StepIndicator step="payment" />

      {/* Confirmation code */}
      <div className="bg-black text-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Tu código de inscripción</p>
          <p className="text-2xl font-black tracking-[0.2em] font-mono">{code}</p>
        </div>
        <p className="text-xs text-zinc-400 sm:text-right">Lo recibirás también<br />por correo electrónico.</p>
      </div>

      {/* Total */}
      <div className="bg-zinc-100 border-l-4 border-brand p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-600">Total a transferir</p>
          {count > 1 && (
            <p className="text-xs text-zinc-400 mt-0.5">{count} integrantes × ${unitPrice}</p>
          )}
        </div>
        <p className="text-4xl font-black text-accent">${total}</p>
      </div>

      {/* Image upload */}
      <div>
        <h4 className="text-sm font-black uppercase tracking-widest mb-3">Comprobante de Pago</h4>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          className="border-2 border-dashed border-zinc-300 hover:border-brand cursor-pointer transition-colors p-8 text-center"
        >
          {fileData ? (
            fileData.isImage ? (
              <div className="space-y-3">
                <img src={fileData.dataUrl} alt="Comprobante" className="max-h-48 mx-auto object-contain" />
                <p className="text-xs text-zinc-400 uppercase tracking-widest">Toca para cambiar</p>
              </div>
            ) : (
              <div className="space-y-3 flex flex-col items-center">
                <FileText size={40} className="text-accent" />
                <p className="font-bold text-zinc-700 text-sm break-all">{fileData.name}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-widest">Toca para cambiar</p>
              </div>
            )
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <Upload size={32} className="text-zinc-300" />
              <p className="font-bold text-zinc-500">Arrastra o toca para subir</p>
              <p className="text-xs text-zinc-400 uppercase tracking-widest">JPG · PNG · PDF</p>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {fileError && <p className={err}>{fileError}</p>}
      </div>

      {serverError && <p className="text-red-500 text-sm font-bold text-center">{serverError}</p>}

      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="w-full bg-accent text-white font-black uppercase italic tracking-widest py-6 hover:bg-brand transition-all disabled:bg-zinc-400"
      >
        {submitting ? 'Procesando...' : 'Confirmar Inscripción'}
      </button>
    </motion.div>
  );
}

// ── Individual Form ───────────────────────────────────────────────────────────
function IndividualForm() {
  const [step, setStep] = useState<Step>('form');
  const [code] = useState<string>(generateCode);
  const [savedData, setSavedData] = useState<IndividualFormData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<IndividualFormData>({
    resolver: zodResolver(individualSchema),
  });

  const onFormSubmit = (data: IndividualFormData) => {
    setSavedData(data);
    setStep('payment');
  };

  const onPaymentConfirm = async (dataUrl: string) => {
    if (!savedData) return;
    setSubmitting(true);
    setServerError('');
    try {
      await postRegistration({ type: 'individual', ...savedData, confirmationCode: code, paymentProof: dataUrl });
      setStep('success');
    } catch {
      setServerError('Error de conexión. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') return <SuccessBanner code={code} />;

  if (step === 'payment') return (
    <PaymentStep
      code={code}
      total={10}
      count={1}
      unitPrice={10}
      onConfirm={onPaymentConfirm}
      onBack={() => setStep('form')}
      submitting={submitting}
      serverError={serverError}
    />
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 bg-zinc-50 p-8 md:p-12 shadow-2xl">
      <StepIndicator step="form" />
      <BankDetailsCard unitPrice={10} />
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={label}>Nombres y Apellidos</label>
          <input {...register('fullName')} className={input} placeholder="Juan Pérez" />
          {errors.fullName && <p className={err}>{errors.fullName.message}</p>}
        </div>
        <div>
          <label className={label}>Fecha de Nacimiento</label>
          <input
            {...register('birthDate')}
            type="text"
            className={input}
            placeholder="DD/MM/AAAA"
            maxLength={10}
            onInput={(e) => {
              let v = e.currentTarget.value.replace(/\D/g, '');
              if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
              if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5);
              e.currentTarget.value = v.slice(0, 10);
            }}
          />
          {errors.birthDate && <p className={err}>{errors.birthDate.message}</p>}
        </div>
        <div>
          <label className={label}>Correo Electrónico</label>
          <input type="email" {...register('email')} className={input} placeholder="juan@ejemplo.com" />
          {errors.email && <p className={err}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={label}>Teléfono</label>
          <input {...register('phone')} type="tel" className={input} placeholder="0999999999" maxLength={10} />
          {errors.phone && <p className={err}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={label}>Ciudad</label>
          <input {...register('city')} className={input} placeholder="Otavalo" />
          {errors.city && <p className={err}>{errors.city.message}</p>}
        </div>
        <div>
          <label className={label}>Género</label>
          <select {...register('gender')} className={`${input} bg-white`}>
            <option value="">Seleccione...</option>
            {cfg.genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          {errors.gender && <p className={err}>{errors.gender.message}</p>}
        </div>
        <div>
          <label className={label}>Talla de Camiseta</label>
          <select {...register('jerseySize')} className={`${input} bg-white`}>
            <option value="">Seleccione...</option>
            {cfg.sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.jerseySize && <p className={err}>{errors.jerseySize.message}</p>}
        </div>
      </div>

      <div>
        <label className={label}>Observaciones</label>
        <textarea
          {...register('observations')}
          rows={3}
          className={`${input} resize-none`}
          placeholder="Información adicional, alergias, requerimientos especiales..."
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          {...register('terms')}
          id="terms-ind"
          className="mt-1 h-5 w-5 accent-brand cursor-pointer"
        />
        <label htmlFor="terms-ind" className="text-sm text-zinc-600 cursor-pointer">
          Acepto los <span className="text-accent font-bold">Términos y Condiciones</span> del evento y confirmo que la información proporcionada es correcta.
        </label>
      </div>
      {errors.terms && <p className={err}>{errors.terms.message}</p>}

      <div className="bg-zinc-100 border-l-4 border-brand p-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase font-bold tracking-widest text-zinc-500">Inscripción Individual</p>
          <p className="text-sm text-zinc-600 mt-0.5">1 participante</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-accent">$10</p>
          <p className="text-xs uppercase tracking-widest text-zinc-500">Total</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-accent text-white font-black uppercase italic tracking-widest py-6 hover:bg-brand transition-all"
      >
        Continuar para subir el pago →
      </button>
    </form>
  );
}

// ── Team Form ─────────────────────────────────────────────────────────────────
function TeamForm() {
  const [step, setStep] = useState<Step>('form');
  const [code] = useState<string>(generateCode);
  const [savedData, setSavedData] = useState<TeamFormData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, control, formState: { errors } } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      members: [{ fullName: '', birthDate: '', email: '', phone: '', gender: '', jerseySize: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'members' });

  const onFormSubmit = (data: TeamFormData) => {
    setSavedData(data);
    setStep('payment');
  };

  const onPaymentConfirm = async (dataUrl: string) => {
    if (!savedData) return;
    setSubmitting(true);
    setServerError('');
    try {
      await postRegistration({ type: 'team', ...savedData, confirmationCode: code, paymentProof: dataUrl });
      setStep('success');
    } catch {
      setServerError('Error de conexión. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') return <SuccessBanner code={code} />;

  if (step === 'payment') return (
    <PaymentStep
      code={code}
      total={savedData ? savedData.members.length * 10 : fields.length * 10}
      count={savedData ? savedData.members.length : fields.length}
      unitPrice={10}
      onConfirm={onPaymentConfirm}
      onBack={() => setStep('form')}
      submitting={submitting}
      serverError={serverError}
    />
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-10 bg-zinc-50 p-8 md:p-12 shadow-2xl">
      <StepIndicator step="form" />
      <BankDetailsCard unitPrice={10} />
      {/* Team info */}
      <div>
        <h3 className="text-lg font-black uppercase italic tracking-widest mb-6 pb-2 border-b-2 border-brand">
          Información del Equipo
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Nombre del Equipo</label>
            <input {...register('teamName')} className={input} placeholder="Los Veloces del Lago" />
            {errors.teamName && <p className={err}>{errors.teamName.message}</p>}
          </div>
          <div>
            <label className={label}>Nombre del Representante</label>
            <input {...register('representativeName')} className={input} placeholder="Juan Pérez" />
            {errors.representativeName && <p className={err}>{errors.representativeName.message}</p>}
          </div>
          <div>
            <label className={label}>Correo Electrónico</label>
            <input type="email" {...register('email')} className={input} placeholder="equipo@ejemplo.com" />
            {errors.email && <p className={err}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={label}>Teléfono</label>
            <input {...register('phone')} className={input} placeholder="+593 99 999 9999" />
            {errors.phone && <p className={err}>{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      {/* Members */}
      <div>
        <h3 className="text-lg font-black uppercase italic tracking-widest mb-6 pb-2 border-b-2 border-brand">
          Integrantes ({fields.length}/{cfg.maxMembers})
        </h3>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white p-6 border-l-4 border-brand">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                  Integrante {index + 1}
                </span>
                {fields.length > cfg.minMembers && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Eliminar integrante"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Nombre Completo</label>
                  <input {...register(`members.${index}.fullName`)} className={input} placeholder="Nombre Apellido" />
                  {errors.members?.[index]?.fullName && (
                    <p className={err}>{errors.members[index]?.fullName?.message}</p>
                  )}
                </div>
                <div>
                  <label className={label}>Fecha de Nacimiento</label>
                  <input
                    {...register(`members.${index}.birthDate`)}
                    type="text"
                    className={input}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    onInput={(e) => {
                      let v = e.currentTarget.value.replace(/\D/g, '');
                      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                      if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5);
                      e.currentTarget.value = v.slice(0, 10);
                    }}
                  />
                  {errors.members?.[index]?.birthDate && (
                    <p className={err}>{errors.members[index]?.birthDate?.message}</p>
                  )}
                </div>
                <div>
                  <label className={label}>Correo Electrónico</label>
                  <input type="email" {...register(`members.${index}.email`)} className={input} placeholder="correo@ejemplo.com" />
                  {errors.members?.[index]?.email && (
                    <p className={err}>{errors.members[index]?.email?.message}</p>
                  )}
                </div>
                <div>
                  <label className={label}>Teléfono</label>
                  <input {...register(`members.${index}.phone`)} type="tel" className={input} placeholder="0999999999" maxLength={10} />
                  {errors.members?.[index]?.phone && (
                    <p className={err}>{errors.members[index]?.phone?.message}</p>
                  )}
                </div>
                <div>
                  <label className={label}>Género</label>
                  <select {...register(`members.${index}.gender`)} className={`${input} bg-white`}>
                    <option value="">Seleccione...</option>
                    {cfg.genders.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.members?.[index]?.gender && (
                    <p className={err}>{errors.members[index]?.gender?.message}</p>
                  )}
                </div>
                <div>
                  <label className={label}>Talla de Camiseta</label>
                  <select {...register(`members.${index}.jerseySize`)} className={`${input} bg-white`}>
                    <option value="">Seleccione...</option>
                    {cfg.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.members?.[index]?.jerseySize && (
                    <p className={err}>{errors.members[index]?.jerseySize?.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {fields.length < cfg.maxMembers && (
          <button
            type="button"
            onClick={() => append({ fullName: '', birthDate: '', email: '', phone: '', gender: '', jerseySize: '' })}
            className="mt-4 flex items-center gap-2 text-accent font-bold uppercase text-sm hover:text-black transition-colors"
          >
            <PlusCircle size={20} />
            Agregar Integrante
          </button>
        )}

        {(errors.members as { message?: string } | undefined)?.message && (
          <p className={err}>{(errors.members as { message?: string }).message}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          {...register('terms')}
          id="terms-team"
          className="mt-1 h-5 w-5 accent-brand cursor-pointer"
        />
        <label htmlFor="terms-team" className="text-sm text-zinc-600 cursor-pointer">
          Acepto los <span className="text-accent font-bold">Términos y Condiciones</span> del evento y confirmo que la información proporcionada es correcta.
        </label>
      </div>
      {errors.terms && <p className={err}>{errors.terms.message}</p>}

      <div className="bg-zinc-100 border-l-4 border-brand p-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase font-bold tracking-widest text-zinc-500">Inscripción Grupal</p>
          <p className="text-sm text-zinc-600 mt-0.5">{fields.length} integrante{fields.length !== 1 ? 's' : ''} × $10</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-accent">${fields.length * 10}</p>
          <p className="text-xs uppercase tracking-widest text-zinc-500">Total</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-accent text-white font-black uppercase italic tracking-widest py-6 hover:bg-brand transition-all"
      >
        Continuar para subir el pago →
      </button>
    </form>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
const Registration: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'individual' | 'team' | null>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedType) {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedType]);

  return (
    <section id="registration" className="py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-4">{cfg.title}</h2>
          <p className="text-zinc-600 text-lg uppercase tracking-widest">{cfg.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6 mb-12">
          <button
            onClick={() => setSelectedType('individual')}
            className={`p-4 md:p-8 border-2 flex flex-col items-center gap-2 md:gap-4 transition-all ${
              selectedType === 'individual'
                ? 'border-brand bg-brand-light'
                : 'border-zinc-200 hover:border-orange-300'
            }`}
          >
            <User className={`w-6 h-6 md:w-10 md:h-10 ${selectedType === 'individual' ? 'text-brand' : 'text-zinc-400'}`} />
            <span className="font-black uppercase italic tracking-widest text-sm md:text-xl">Individual</span>
          </button>
          <button
            onClick={() => setSelectedType('team')}
            className={`p-4 md:p-8 border-2 flex flex-col items-center gap-2 md:gap-4 transition-all ${
              selectedType === 'team'
                ? 'border-brand bg-brand-light'
                : 'border-zinc-200 hover:border-orange-300'
            }`}
          >
            <Users className={`w-6 h-6 md:w-10 md:h-10 ${selectedType === 'team' ? 'text-brand' : 'text-zinc-400'}`} />
            <span className="font-black uppercase italic tracking-widest text-sm md:text-xl">Grupal</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {selectedType && (
            <motion.div
              key={selectedType}
              ref={formSectionRef}
              style={{ scrollMarginTop: '96px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedType === 'individual' ? <IndividualForm /> : <TeamForm />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Registration;
