'''
Show progress in scraper
'''

import time

def progressbar(progress, *args, start='[', end=']', marker='', fill='█', bg=' ',
	length=20, verbose=True):

	left = int(length * progress)
	right = length - left

	out = start + fill*left + marker + bg*right + end

	if verbose:
		out += ' {:.2f}%'.format(progress*100)

	print(out, *args, end='\r')



def crabby(*args, **kwargs):
	progressbar(*args, start='🐚', end='🏁 ', marker='🦀', fill=' ', **kwargs)


def loader(*args, start='[', end=']', marker='🦀', bg=' ', speed=20,
	length=18, progress=None, bounce=None, verbose=True):

	guy = marker

	if bounce:
		i = length - int(time.time() * speed) % (2*length)
		if i > 0:
			guy = bounce
		i = abs(i)
	else:
		i = int(time.time() * speed) % length

	out = start + i*bg + guy + (length-i)*bg + end

	if verbose and progress is not None:
		out += ' {:.2f}%'.format(progress*100)

	print(out, *args, end='\r')

def clocky(*args, **kwargs):
	i = int(time.time() * 10) % 12
	emoji = bytes([240, 159, 149, 144 + i]).decode('utf-8')

	loader(*args, start='', end=' ', marker=emoji, bg='', **kwargs)