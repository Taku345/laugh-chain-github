import Checkbox from '@/OriginalComponents/Checkbox';
import InputError from '@/OriginalComponents/InputError';
import InputLabel from '@/OriginalComponents/InputLabel';
import PrimaryButton from '@/OriginalComponents/PrimaryButton';
import TextInput from '@/OriginalComponents/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

declare var route

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        public_key: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('public_key'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="public_key" value="Public Key" />

                    <TextInput
                        id="public_key"
                        type="password"
                        name="public_key"
                        value={data.public_key}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('public_key', e.target.value)}
                    />

                    <InputError message={errors.public_key} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Join
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
