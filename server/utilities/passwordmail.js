function passwordmail (email, firstname, reset) {
	this.from =  'phethulwazib.donga@gmail.com', // sender address
	this.to = email, // list of receivers
	this.subject = "Password Reset", // Subject line
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
					<p style="font-size: 15px; margin-bottom: 20px;">
						You've recently requested to reset your password for your zero account.
						Please use the the link to reset it.
					</p>
					<a href=http://localhost:3000/password/${reset} style="text-decoration: none;">
						<span style="background: #000; border: none; border-radius: 0px; font-family: sans-serif;
							padding: 12px 20px; min-width: 200px; margin: 10px; cursor: pointer; font-size: 15px; color: #fff">
								Reset
						</span>
					<a/>
				</div>
			</div>
		`
}

module.exports = passwordmail;