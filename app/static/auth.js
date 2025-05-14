document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabLinks = document.querySelectorAll('.tab-link');
    const authForms = document.querySelectorAll('.auth-form');

    tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            
            // Remove active class from all tabs and forms
            tabLinks.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const data = {
                username: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('/auth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    localStorage.setItem('token', result.access_token);
                    window.location.href = '/profile';
                } else {
                    throw new Error('Ошибка авторизации');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка при входе. Пожалуйста, проверьте свои данные.');
            }
        });
    }

    // Registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const data = {
                email: formData.get('email'),
                password: formData.get('password'),
                full_name: formData.get('full_name')
            };

            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Регистрация прошла успешно! Теперь вы можете войти.');
                    document.querySelector('[data-tab="login"]').click();
                } else {
                    throw new Error('Ошибка регистрации');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
            }
        });
    }

    // Logout functionality
    const logoutLink = document.querySelector('a[href="/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                await fetch('/auth/logout', {
                    method: 'POST'
                });
                localStorage.removeItem('token');
                window.location.href = '/';
            } catch (error) {
                console.error('Ошибка при выходе:', error);
            }
        });
    }
});
