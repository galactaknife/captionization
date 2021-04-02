import subprocess

def captionize(vid, srt, output):
    # Use subprocess to execute the shell command
    subprocess.Popen(str("ffmpeg -i " + vid + " -vf subtitles=" + srt + " " + output).split(), stdout=subprocess.PIPE).communicate()
