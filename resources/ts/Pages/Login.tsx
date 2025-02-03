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
        private_key: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('private_key'),
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
                    <InputLabel htmlFor="private_key" value="Private Key" />

                    <TextInput
                        id="private_key"
                        type="password"
                        name="private_key"
                        value={data.private_key}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('private_key', e.target.value)}
                    />

                    <InputError message={errors.private_key} className="mt-2" />
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
