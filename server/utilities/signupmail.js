function signupMail (email, firstname, key) {
	this.from = 'phethulwazib.donga@gmail.com',
	this.to = email,
	this.subject = "Account Verification",
	this.html = 
		`
		<div style="margin: 0; padding: 0; background: #fff; font-family: sans-serif; color: #000; height:240px;">
			<div style="justify-content: center; align-content: center; text-align: center; margin: auto; width: 80%; height:100%">
				<header>
					<a href="href=http://localhost:3000/" class="logo" style="color: black; height: 60px; line-height: 60px; padding: 0 20;
						text-align: center; font-weight: 700; text-decoration: none; font-size: 35px;">
							bioskop
					</a>
				</header>
					<h2>Hi ${firstname}</h2>
					<p style="font-size: 15px; margin-bottom: 20px;">Thank you for signing up to zero. Please click this link to verify your account</p>
					<a href=http://localhost:3000/verify/${key} style="text-decoration: none;">
						<span 
							style="background: #000; border: none; border-radius: 0px; font-family: sans-serif;
							padding: 12px 20px; min-width: 200px; margin: 10px; cursor: pointer; font-size: 15px; color: #fff">
								Verify
						</span>
					<a/>
				</div>
			</div>
		`
}

module.exports = signupMail;